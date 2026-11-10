import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {SceneShell, VISUAL_CX} from '../components/SceneShell';
import {SceneDef} from '../script';

// FAIT N°2 : l'odeur de l'espace — casque d'astronaute + volutes d'odeur qui montent.
export const Fact2: React.FC<{scene: SceneDef}> = ({scene}) => {
  const frame = useCurrentFrame();
  const cy = 680;
  const bob = Math.sin(frame / 14) * 12;
  const tilt = Math.sin(frame / 22) * 6;

  const visual = (
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd36b" />
          <stop offset="50%" stopColor="#c0508a" />
          <stop offset="100%" stopColor="#2a0c40" />
        </linearGradient>
      </defs>
      {/* volutes d'odeur */}
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 20) % 60) / 60;
        const y = cy - 170 - t * 160;
        const x = VISUAL_CX - 110 + i * 110;
        return (
          <path
            key={i}
            d={`M ${x} ${y + 90} q 30 -22 0 -45 t 0 -45`}
            stroke="#ffb3e6"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
            opacity={interpolate(t, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0])}
          />
        );
      })}
      <g transform={`translate(0 ${bob}) rotate(${tilt} ${VISUAL_CX} ${cy})`}>
        <circle cx={VISUAL_CX} cy={cy} r={175} fill="#f2f2f7" stroke="#9aa0b5" strokeWidth={10} />
        <rect x={VISUAL_CX - 120} y={cy - 85} width={240} height={170} rx={80} fill="url(#visor)" />
        <ellipse cx={VISUAL_CX - 55} cy={cy - 40} rx={40} ry={18} fill="white" opacity={0.6} />
        <rect x={VISUAL_CX - 150} y={cy + 140} width={300} height={70} rx={30} fill="#d8dbe6" />
      </g>
    </svg>
  );

  return <SceneShell scene={scene} badge="FAIT N°2" visual={visual} />;
};
