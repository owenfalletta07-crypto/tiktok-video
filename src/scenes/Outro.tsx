import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneShell, VISUAL_CX} from '../components/SceneShell';
import {SceneDef, YELLOW} from '../script';

// CHUTE + appel à l'action : gros "4 ?" puis bouton "+ ABONNE-TOI" pulsant.
export const Outro: React.FC<{scene: SceneDef}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glitch = frame % 9 < 2 ? 8 : 0;
  const btn = spring({frame: frame - 44, fps, config: {damping: 9, stiffness: 200}});
  const pulse = 1 + 0.06 * Math.sin(frame / 3);
  const bigScale = interpolate(frame, [0, 90], [1, 1.2]);

  const visual = (
    <>
      <div
        style={{
          position: 'absolute',
          left: VISUAL_CX - 300,
          top: 300,
          width: 600,
          height: 560,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'InterBlack',
          fontSize: 440,
          lineHeight: 1,
          color: 'white',
          transform: `scale(${bigScale}) translateX(${glitch}px)`,
          textShadow: `${-glitch}px 0 0 #ff2d7a, ${glitch}px 0 0 #00e5ff, 0 0 60px rgba(255,255,255,0.35)`,
        }}
      >
        4?
      </div>
      <div
        style={{
          position: 'absolute',
          left: VISUAL_CX - 300,
          width: 600,
          top: 1500,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'InterBlack',
            fontSize: 64,
            color: '#111',
            background: YELLOW,
            padding: '18px 44px',
            borderRadius: 999,
            transform: `scale(${btn * pulse})`,
            boxShadow: '0 0 50px rgba(255,230,0,0.6)',
          }}
        >
          + ABONNE-TOI
        </div>
      </div>
    </>
  );

  return <SceneShell scene={scene} visual={visual} captionTop={1150} />;
};
