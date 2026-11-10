import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, VISUAL_CX} from '../components/SceneShell';
import {SceneDef} from '../script';

// FAIT N°3 : étoile à neutrons (pulsar) — cœur brillant pulsant et faisceaux en rotation.
export const Fact3: React.FC<{scene: SceneDef}> = ({scene}) => {
  const frame = useCurrentFrame();
  const cy = 660;
  const pulse = 1 + 0.12 * Math.sin(frame / 3);
  const angle = frame * 4;
  const zoom = interpolate(frame, [0, 180], [0.9, 1.2]);

  const visual = (
    <svg
      width={1080}
      height={1920}
      style={{position: 'absolute', left: 0, top: 0, transform: `scale(${zoom})`, transformOrigin: `${VISUAL_CX}px ${cy}px`}}
    >
      <defs>
        <radialGradient id="ns" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#bfe9ff" />
          <stop offset="100%" stopColor="#1f6fff" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fe0ff" stopOpacity={0} />
          <stop offset="50%" stopColor="#dff6ff" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#9fe0ff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${angle} ${VISUAL_CX} ${cy})`}>
        <polygon points={`${VISUAL_CX - 30},${cy} ${VISUAL_CX + 30},${cy} ${VISUAL_CX + 90},${cy - 340} ${VISUAL_CX - 90},${cy - 340}`} fill="url(#beam)" />
        <polygon points={`${VISUAL_CX - 30},${cy} ${VISUAL_CX + 30},${cy} ${VISUAL_CX + 90},${cy + 340} ${VISUAL_CX - 90},${cy + 340}`} fill="url(#beam)" />
      </g>
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 15) % 45) / 45;
        return <circle key={i} cx={VISUAL_CX} cy={cy} r={60 + t * 240} fill="none" stroke="#9fe0ff" strokeWidth={4} opacity={1 - t} />;
      })}
      <circle cx={VISUAL_CX} cy={cy} r={170 * pulse} fill="url(#ns)" />
      <circle cx={VISUAL_CX} cy={cy} r={48} fill="white" />
    </svg>
  );

  return <SceneShell scene={scene} badge="FAIT N°3" visual={visual} />;
};
