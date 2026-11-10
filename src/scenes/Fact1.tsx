import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, VISUAL_CX} from '../components/SceneShell';
import {SceneDef} from '../script';

// FAIT N°1 : Vénus — une planète qui tourne très lentement, avec son orbite autour du Soleil.
export const Fact1: React.FC<{scene: SceneDef}> = ({scene}) => {
  const frame = useCurrentFrame();
  const bandShift = frame * 0.6; // rotation très lente des bandes
  const orbit = (frame / 180) * Math.PI * 2;
  const R = 170;
  const cy = 640;
  const zoom = interpolate(frame, [0, 180], [0.95, 1.15]);

  const visual = (
    <svg
      width={1080}
      height={1920}
      style={{position: 'absolute', left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: `${VISUAL_CX}px ${cy}px`}}
    >
      <defs>
        <radialGradient id="venus" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffe3a3" />
          <stop offset="45%" stopColor="#f0a040" />
          <stop offset="100%" stopColor="#6b2a05" />
        </radialGradient>
        <clipPath id="vclip">
          <circle cx={VISUAL_CX} cy={cy} r={R} />
        </clipPath>
        <filter id="glow1">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <ellipse cx={VISUAL_CX} cy={cy} rx={330} ry={110} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="10 14" />
      <circle cx={VISUAL_CX} cy={cy} r={R + 30} fill="#ff9a30" opacity={0.45} filter="url(#glow1)" />
      <circle cx={VISUAL_CX} cy={cy} r={R} fill="url(#venus)" />
      <g clipPath="url(#vclip)" opacity={0.35}>
        {[-120, -60, 0, 50, 110].map((dy, i) => (
          <path
            key={i}
            d={`M ${VISUAL_CX - 260 + ((bandShift + i * 40) % 120)} ${cy + dy} q 120 ${i % 2 ? 30 : -30} 240 0 t 240 0 t 240 0`}
            stroke="#fff3d6"
            strokeWidth={14 + i * 3}
            fill="none"
          />
        ))}
      </g>
      <circle cx={VISUAL_CX + Math.cos(orbit) * 330} cy={cy + Math.sin(orbit) * 110} r={18} fill="#7fd0ff" />
    </svg>
  );

  return <SceneShell scene={scene} badge="FAIT N°1" visual={visual} />;
};
