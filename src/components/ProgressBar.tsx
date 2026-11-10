import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {YELLOW} from '../script';

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();
  const progress = (frame + 1) / durationInFrames;
  return (
    <div style={{position: 'absolute', top: 0, left: 0, width, height: 10, background: 'rgba(255,255,255,0.18)'}}>
      <div
        style={{
          width: width * progress,
          height: '100%',
          background: YELLOW,
          boxShadow: `0 0 14px ${YELLOW}`,
        }}
      />
    </div>
  );
};
