import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';
import {SceneShell, VISUAL_CX} from '../components/SceneShell';
import {SceneDef, YELLOW} from '../script';

// HOOK (0 – 2,5 s) : texte choc + gros "?!" qui tremble.
export const Hook: React.FC<{scene: SceneDef}> = ({scene}) => {
  const frame = useCurrentFrame();
  const shakeAmp = interpolate(frame, [0, 20], [22, 4], {extrapolateRight: 'clamp'});
  const sx = (random(`hx${frame}`) - 0.5) * shakeAmp;
  const sy = (random(`hy${frame}`) - 0.5) * shakeAmp;
  const scale = interpolate(frame, [0, 75], [1, 1.25]);

  const visual = (
    <div
      style={{
        position: 'absolute',
        left: VISUAL_CX - 300,
        top: 330,
        width: 600,
        height: 520,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translate(${sx}px, ${sy}px) scale(${scale}) rotate(-6deg)`,
        fontFamily: 'InterBlack',
        fontSize: 420,
        color: YELLOW,
        textShadow: '0 0 60px rgba(255,230,0,0.6), 0 16px 0 rgba(0,0,0,0.5)',
        lineHeight: 1,
      }}
    >
      ?!
    </div>
  );

  return <SceneShell scene={scene} visual={visual} captionTop={1200} />;
};
