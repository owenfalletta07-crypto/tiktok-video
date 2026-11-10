# tiktok-video

Vidéo TikTok verticale (1080×1920, 30 fps, 23,5 s) générée entièrement par code avec Remotion.

- Script et minutage : `SCRIPT.md`
- Rendu : `npm install && npm run render` → `out/tiktok.mp4`
- Aperçu interactif : `npm run studio`

Structure : `src/script.ts` (textes + minutage), `src/scenes/*` (une scène par composant),
`src/components/*` (fond étoilé, sous-titres mot par mot, barre de progression, habillage de scène).

## Voix off
Voix de synthèse française générée hors ligne avec [Piper](https://github.com/rhasspy/piper), voix `fr_FR-siwis-medium`
(jeu de données SIWIS, Université d'Édimbourg, licence CC-BY 4.0 — attribution requise).

```bash
pip install piper-tts numpy
curl -LO https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-fr_FR-siwis-medium.tar.bz2
tar xjf vits-piper-fr_FR-siwis-medium.tar.bz2
python3 tools/voiceover.py vits-piper-fr_FR-siwis-medium   # -> public/vo, public/sfx, src/timing.json
npm run render
```
La nappe sonore et le « whoosh » sont synthétisés par le même script (aucun fichier audio externe).
