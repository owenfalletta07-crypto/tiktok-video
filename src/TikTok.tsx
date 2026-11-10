import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {ProgressBar} from './components/ProgressBar';
import {Fact1} from './scenes/Fact1';
import {Fact2} from './scenes/Fact2';
import {Fact3} from './scenes/Fact3';
import {Hook} from './scenes/Hook';
import {Outro} from './scenes/Outro';
import {SCENES} from './script';

const fontCss = `@font-face { font-family: 'InterBlack'; src: url('${staticFile('Inter-Black.otf')}') format('opentype'); font-weight: 900; }`;

const COMPONENTS: Record<string, React.FC<{scene: (typeof SCENES)[number]}>> = {
  hook: Hook,
  fact1: Fact1,
  fact2: Fact2,
  fact3: Fact3,
  outro: Outro,
};

export const TikTok: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#03020a', overflow: 'hidden'}}>
    <style>{fontCss}</style>
    <Background />
    {/* Ambiance : nappe grave discrète + whoosh à chaque changement de scène */}
    <Audio src={staticFile('sfx/pad.wav')} volume={0.18} />
    {SCENES.slice(1).map((scene) => (
      <Sequence key={`w-${scene.id}`} from={Math.max(0, scene.from - 6)} durationInFrames={14}>
        <Audio src={staticFile('sfx/whoosh.wav')} volume={0.35} />
      </Sequence>
    ))}
    {SCENES.map((scene) => {
      const Comp = COMPONENTS[scene.id];
      return (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration} name={scene.id}>
          <Comp scene={scene} />
        </Sequence>
      );
    })}
    <ProgressBar />
  </AbsoluteFill>
);
