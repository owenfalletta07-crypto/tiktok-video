// Script + minutage. Les mots entre *astérisques* sont surlignés en jaune.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Zone sûre TikTok : rien dans les 250 px du bas ni les 150 px de droite.
export const SAFE = {left: 70, right: 170, top: 180, bottom: 270};

export const YELLOW = '#FFE600';

import timing from './timing.json';

export type Line = {
  text: string;
  spoken: string;
  audio: string; // clip de voix off (dossier public/)
  from: number; // relatif au début de la scène
  duration: number;
  voiceFrames: number; // durée de la voix, pour synchroniser les mots
  enter: 'zoom' | 'slide';
};

export type SceneDef = {
  id: string;
  from: number;
  duration: number;
  hue: number; // teinte du fond
  lines: Line[];
};

const HUES: Record<string, number> = {hook: 265, fact1: 20, fact2: 300, fact3: 200, outro: 330};

// Le minutage est calculé à partir des durées réelles de la voix off (tools/voiceover.py -> timing.json).
const buildScenes = (): SceneDef[] => {
  const scenes: SceneDef[] = [];
  let cursor = 0;
  timing.lines.forEach((l, i) => {
    let scene = scenes[scenes.length - 1];
    if (!scene || scene.id !== l.scene) {
      scene = {id: l.scene, from: cursor, duration: 0, hue: HUES[l.scene], lines: []};
      scenes.push(scene);
    }
    scene.lines.push({
      text: l.text,
      spoken: l.spoken,
      audio: l.audio,
      from: cursor - scene.from,
      duration: l.duration,
      voiceFrames: l.voiceFrames,
      enter: i % 2 === 0 ? 'zoom' : 'slide',
    });
    cursor += l.duration;
    scene.duration = cursor - scene.from;
  });
  const last = scenes[scenes.length - 1];
  last.duration += timing.total - cursor;
  last.lines[last.lines.length - 1].duration += timing.total - cursor;
  return scenes;
};

export const SCENES = buildScenes();

export const TOTAL_FRAMES = timing.total;

// Découpe "a *b c* d" en mots ; un mot est surligné s'il est (même en partie) entre astérisques.
export const parseWords = (text: string) => {
  let on = false;
  return text.split(' ').map((raw) => {
    const stars = (raw.match(/\*/g) || []).length;
    const hl = on || stars > 0;
    if (stars % 2 === 1) on = !on;
    return {w: raw.replace(/\*/g, ''), hl};
  });
};
