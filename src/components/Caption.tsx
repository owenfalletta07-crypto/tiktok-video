import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Line, parseWords, YELLOW} from '../script';


// Une ligne de sous-titre : apparition mot par mot, transition d'entrée (zoom ou glissement) et sortie rapide.
export const Caption: React.FC<{line: Line; fontSize?: number}> = ({line, fontSize = 112}) => {
  const frame = useCurrentFrame(); // relatif au début de la ligne (Sequence)
  const {fps} = useVideoConfig();
  const words = parseWords(line.text);

  // Sous-titres mot par mot calés sur la voix : chaque mot apparaît proportionnellement à sa longueur.
  // « Numéro un : » est prononcé mais affiché dans le badge : les mots démarrent après ce préfixe.
  const prefix = line.spoken.match(/^Numéro \S+ : /)?.[0] ?? '';
  const offset = Math.round((prefix.length / line.spoken.length) * line.voiceFrames);
  const span = (line.voiceFrames - offset) * 0.9;
  const totalChars = words.reduce((a, w) => a + w.w.length + 1, 0);
  let acc = 0;
  const starts = words.map((w) => {
    const start = offset + Math.round((acc / totalChars) * span);
    acc += w.w.length + 1;
    return start;
  });

  const enter = spring({frame, fps, config: {damping: 14, stiffness: 180}});
  const exit = interpolate(frame, [line.duration - 5, line.duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // Léger zoom continu pour qu'aucun plan ne soit fixe.
  const drift = interpolate(frame, [0, line.duration], [1, 1.06]);
  // Ligne longue (> 2 s) : petit « punch » de zoom à 1,7 s pour casser le plan.
  const punch =
    line.duration > 60 ? interpolate(frame, [50, 54, 62], [0, 0.07, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  let transform: string;
  if (line.enter === 'zoom') {
    const s = interpolate(enter, [0, 1], [1.8, 1]) * (drift + punch) * interpolate(exit, [0, 1], [1, 0.6]);
    transform = `scale(${s})`;
  } else {
    const x = interpolate(enter, [0, 1], [700, 0]) + interpolate(exit, [0, 1], [0, -700]);
    transform = `translateX(${x}px) scale(${drift + punch})`;
  }
  const opacity = Math.min(interpolate(enter, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}), 1 - exit);

  return (
    <div
      style={{
        transform,
        opacity,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: fontSize * 0.28,
        rowGap: fontSize * 0.08,
        width: '100%',
      }}
    >
      {words.map((w, i) => {
        const wf = frame - starts[i];
        const pop = spring({frame: wf, fps, config: {damping: 10, stiffness: 260, mass: 0.6}});
        const visible = wf >= 0;
        return (
          <span
            key={i}
            style={{
              fontFamily: 'InterBlack',
              fontSize,
              lineHeight: 1.08,
              textTransform: 'uppercase',
              color: w.hl ? '#111' : 'white',
              background: w.hl ? YELLOW : 'transparent',
              padding: w.hl ? `0 ${fontSize * 0.12}px` : 0,
              borderRadius: fontSize * 0.14,
              boxShadow: w.hl ? `0 0 40px rgba(255,230,0,0.45)` : 'none',
              textShadow: w.hl ? 'none' : '0 6px 0 rgba(0,0,0,0.55), 0 0 30px rgba(0,0,0,0.6)',
              WebkitTextStroke: w.hl ? 0 : '3px black',
              paintOrder: 'stroke fill',
              opacity: visible ? 1 : 0,
              transform: `scale(${visible ? interpolate(pop, [0, 1], [0.4, 1]) : 0.4}) rotate(${w.hl ? -2 : 0}deg)`,
              display: 'inline-block',
              letterSpacing: -2,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
