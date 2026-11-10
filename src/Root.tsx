import React from 'react';
import {Composition} from 'remotion';
import {TikTok} from './TikTok';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './script';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TikTok"
    component={TikTok}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
