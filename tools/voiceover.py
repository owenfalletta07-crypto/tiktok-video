"""Génère la voix off (Piper fr_FR-siwis, paquet pip piper-tts), l'ambiance sonore, et le minutage.

Usage : python3 tools/voiceover.py <dossier_du_modele_siwis>
Sorties : public/vo/line_XX.wav, public/sfx/*.wav, src/timing.json
Chaque ligne de sous-titre = un clip de voix ; la durée de la ligne suit la durée du clip.
"""
import json
import sys
import wave
from pathlib import Path

import numpy as np
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
SPEED = 1.2  # débit un peu plus rapide, style TikTok
GAP = 3       # images de respiration après chaque phrase
MIN_LINE = 30 # une ligne dure au moins 1 s

# (scène, texte à l'écran, texte prononcé)
LINES = [
    ("hook", "Personne ne t'a appris *ÇA*", "Personne ne t'a appris ça !"),
    ("hook", "3 faits *FOUS* sur l'*ESPACE*", "Trois faits fous sur l'espace."),
    ("fact1", "Une journée sur *VÉNUS*", "Numéro un : une journée sur Vénus"),
    ("fact1", "dure plus qu'une *ANNÉE*", "dure plus longtemps qu'une année !"),
    ("fact1", "*243 JOURS* contre 225 !", "Deux cent quarante-trois jours, contre deux cent vingt-cinq."),
    ("fact2", "L'espace a une *ODEUR*", "Numéro deux : l'espace a une odeur."),
    ("fact2", "Métal brûlé et *VIANDE GRILLÉE*", "Métal brûlé, et viande grillée !"),
    ("fact2", "selon les *ASTRONAUTES*", "C'est ce que racontent les astronautes."),
    ("fact3", "Une cuillère d'*ÉTOILE À NEUTRONS*", "Numéro trois : une cuillère d'étoile à neutrons"),
    ("fact3", "pèse *UN MILLIARD* de tonnes", "pèse environ un milliard de tonnes."),
    ("fact3", "Comme *100 000 TOURS EIFFEL*", "Autant que cent mille tours Eiffel !"),
    ("outro", "Et le 4e est *PIRE*…", "Et le quatrième est encore pire…"),
    ("outro", "Abonne-toi pour la *PARTIE 2*", "Abonne-toi pour la partie deux !"),
]


def write_wav(path: Path, samples: np.ndarray, sr: int):
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = (np.clip(samples, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(pcm.tobytes())


def trim(samples: np.ndarray, sr: int, thr=0.01):
    idx = np.where(np.abs(samples) > thr)[0]
    if len(idx) == 0:
        return samples
    a = max(0, idx[0] - int(0.02 * sr))
    b = min(len(samples), idx[-1] + int(0.06 * sr))
    return samples[a:b]


def main(model_dir: str):
    d = Path(model_dir)
    voice = PiperVoice.load(str(d / "fr_FR-siwis-medium.onnx"), config_path=str(d / "fr_FR-siwis-medium.onnx.json"))
    sr = voice.config.sample_rate
    syn = SynthesisConfig(length_scale=1 / SPEED)

    lines, cursor = [], 0
    for i, (scene, text, spoken) in enumerate(LINES):
        chunks = [c.audio_float_array for c in voice.synthesize(spoken, syn_config=syn)]
        s = trim(np.concatenate(chunks).astype(np.float32), sr)
        s = s / max(1e-6, np.abs(s).max()) * 0.9
        write_wav(ROOT / f"public/vo/line_{i:02d}.wav", s, sr)
        frames = max(MIN_LINE, int(np.ceil(len(s) / sr * FPS)) + GAP)
        lines.append({"scene": scene, "text": text, "spoken": spoken, "audio": f"vo/line_{i:02d}.wav",
                      "voiceFrames": int(np.ceil(len(s) / sr * FPS)), "duration": frames})
        cursor += frames
        print(f"{i:02d} {frames/FPS:5.2f}s  {spoken}")

    total = cursor + 12  # petite queue après la dernière phrase
    print(f"TOTAL {total/FPS:.2f}s")
    (ROOT / "src/timing.json").write_text(json.dumps({"fps": FPS, "total": total, "lines": lines},
                                                     ensure_ascii=False, indent=2))
    make_sfx(total)


def make_sfx(total_frames: int, sr=44100):
    """Nappe spatiale grave + « whoosh » de transition, synthétisés (aucun fichier externe)."""
    rng = np.random.default_rng(7)
    n = int(total_frames / FPS * sr)
    t = np.arange(n) / sr
    pad = sum(np.sin(2 * np.pi * f * t + p) * a for f, p, a in
              [(55, 0, 0.5), (82.4, 1, 0.3), (110, 2, 0.2), (164.8, 0.5, 0.12)])
    pad *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.15 * t)
    fade = np.minimum(1, np.minimum(t / 0.8, (t[-1] - t) / 1.2))
    write_wav(ROOT / "public/sfx/pad.wav", pad / np.abs(pad).max() * 0.5 * fade, sr)

    m = int(0.45 * sr)
    tw = np.arange(m) / sr
    noise = rng.standard_normal(m)
    # bruit filtré dont la "brillance" monte puis redescend
    k = np.clip(np.sin(np.pi * tw / tw[-1]), 0, 1)
    out, y = np.zeros(m), 0.0
    for j in range(m):
        alpha = 0.02 + 0.5 * k[j]
        y += alpha * (noise[j] - y)
        out[j] = y
    out *= np.sin(np.pi * tw / tw[-1]) ** 2
    write_wav(ROOT / "public/sfx/whoosh.wav", out / np.abs(out).max() * 0.8, sr)


if __name__ == "__main__":
    main(sys.argv[1])
