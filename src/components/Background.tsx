import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {HEIGHT, SCENES, WIDTH} from '../script';

const STAR_COUNT = 220;

// Teinte du fond : transition douce entre les scènes.
const hueAt = (frame: number) => {
  const inputs = SCENES.flatMap((s) => [s.from, s.from + 12]).slice(1);
  const outputs = SCENES.flatMap((s, i) => [SCENES[Math.max(0, i - 1)].hue, s.hue]).slice(1);
  return interpolate(frame, inputs, outputs, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const hue = hueAt(frame);

  const stars = useMemo(
    () =>
      new Array(STAR_COUNT).fill(0).map((_, i) => ({
        x: random(`x${i}`) * 2 - 1,
        y: random(`y${i}`) * 2 - 1,
        z0: random(`z${i}`),
        size: 1 + random(`s${i}`) * 2.5,
        twinkle: random(`t${i}`) * Math.PI * 2,
      })),
    []
  );

  // Vitesse du champ d'étoiles : accélère brièvement à chaque changement de scène.
  const boost = SCENES.reduce(
    (acc, s) => acc + interpolate(frame - s.from, [0, 4, 20], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    0
  );
  const speed = 0.006 + boost * 0.03;

  const cx = WIDTH / 2;
  const cy = HEIGHT * 0.45;
  // Position "temps" intégrée simplement : base linéaire + décalage des boosts.
  const travel = frame * 0.006 + SCENES.reduce((acc, s) => acc + Math.max(0, Math.min(1, (frame - s.from) / 20)) * 0.35, 0);

  const nebulaX = 50 + Math.sin(frame / 60) * 18;
  const nebulaY = 40 + Math.cos(frame / 75) * 12;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at ${nebulaX}% ${nebulaY}%, hsl(${hue}, 80%, 22%) 0%, hsl(${hue + 30}, 70%, 9%) 45%, #03020a 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${100 - nebulaX}% ${100 - nebulaY}%, hsla(${hue - 60}, 90%, 45%, 0.25) 0%, transparent 55%)`,
        }}
      />
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute'}}>
        {stars.map((s, i) => {
          const z = 1 - ((s.z0 + travel) % 1); // 1 = loin, 0 = proche
          const zz = Math.max(z, 0.04);
          const px = cx + (s.x * WIDTH * 0.5) / zz;
          const py = cy + (s.y * HEIGHT * 0.5) / zz;
          const r = s.size * (1.2 - z) * 1.6;
          const alpha = interpolate(z, [0, 0.15, 0.9, 1], [0, 1, 0.6, 0]) * (0.7 + 0.3 * Math.sin(frame / 6 + s.twinkle));
          // traînée de vitesse
          const tz = Math.min(1, zz + speed * 6);
          const tx = cx + (s.x * WIDTH * 0.5) / tz;
          const ty = cy + (s.y * HEIGHT * 0.5) / tz;
          return (
            <g key={i} opacity={alpha}>
              <line x1={tx} y1={ty} x2={px} y2={py} stroke="white" strokeWidth={r * 0.8} strokeLinecap="round" />
              <circle cx={px} cy={py} r={r} fill="white" />
            </g>
          );
        })}
      </svg>
      {/* vignette pour la lisibilité du texte */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
