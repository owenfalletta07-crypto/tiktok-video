import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SAFE, SceneDef, WIDTH, YELLOW} from '../script';
import {Caption} from './Caption';

const SAFE_WIDTH = WIDTH - SAFE.left - SAFE.right; // 840 px

// Taille de police adaptée au mot le plus long pour ne jamais déborder de la zone sûre.
const fitFontSize = (text: string, max = 116) => {
  const longest = Math.max(...text.replace(/\*/g, '').split(' ').map((w) => w.length));
  return Math.min(max, Math.floor(SAFE_WIDTH / (longest * 0.8 + 0.4)));
};

type Props = {
  scene: SceneDef;
  badge?: string;
  visual?: React.ReactNode;
  captionTop?: number; // position verticale (px absolus) du centre de la zone de sous-titres
};

// Habillage commun d'une scène : zoom d'entrée, flash, badge, visuel et sous-titres dans la zone sûre.
export const SceneShell: React.FC<Props> = ({scene, badge, visual, captionTop = 1220}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  const sceneScale = interpolate(enter, [0, 1], [1.35, 1]);
  const flash = interpolate(frame, [0, 6], [0.75, 0], {extrapolateRight: 'clamp'});

  const badgePop = spring({frame: frame - 2, fps, config: {damping: 9, stiffness: 220}});

  return (
    <AbsoluteFill style={{transform: `scale(${sceneScale})`}}>
      {visual}

      {badge ? (
        <div
          style={{
            position: 'absolute',
            top: SAFE.top + 60,
            left: SAFE.left,
            width: SAFE_WIDTH,
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
              padding: '10px 34px',
              borderRadius: 18,
              transform: `scale(${badgePop}) rotate(-3deg)`,
              boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
              letterSpacing: 1,
            }}
          >
            {badge}
          </div>
        </div>
      ) : null}

      {/* Zone de sous-titres : 840 px de large, centrée dans la zone sûre */}
      <div
        style={{
          position: 'absolute',
          left: SAFE.left,
          width: SAFE_WIDTH,
          top: captionTop - 260,
          height: 520,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {scene.lines.map((line, i) => (
          <Sequence key={i} from={line.from} durationInFrames={line.duration} layout="none">
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
              <Caption line={line} fontSize={fitFontSize(line.text)} />
            </div>
            <Audio src={staticFile(line.audio)} />
          </Sequence>
        ))}
      </div>

      <AbsoluteFill style={{background: 'white', opacity: flash, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

export const VISUAL_CX = SAFE.left + SAFE_WIDTH / 2; // 490 px
