// Script + minutage. Les mots entre *astérisques* sont surlignés en jaune.
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Zone sûre TikTok : rien dans les 250 px du bas ni les 150 px de droite.
export const SAFE = {left: 70, right: 170, top: 180, bottom: 270};

export const YELLOW = '#FFE600';

export type Line = {text: string; from: number; duration: number; enter: 'zoom' | 'slide'};

export type SceneDef = {
  id: string;
  from: number;
  duration: number;
  hue: number; // teinte du fond
  lines: Line[];
};

const L = (text: string, from: number, duration: number, enter: Line['enter']): Line => ({
  text,
  from,
  duration,
  enter,
});

export const SCENES: SceneDef[] = [
  {
    id: 'hook',
    from: 0,
    duration: 75,
    hue: 265,
    lines: [L("Personne ne t'a appris *ÇA*", 0, 36, 'zoom'), L("3 faits *FOUS* sur l'*ESPACE*", 36, 39, 'slide')],
  },
  {
    id: 'fact1',
    from: 75,
    duration: 180,
    hue: 20,
    lines: [
      L('Une journée sur *VÉNUS*', 0, 60, 'zoom'),
      L("dure plus qu'une *ANNÉE*", 60, 60, 'slide'),
      L('*243 JOURS* contre 225 !', 120, 60, 'zoom'),
    ],
  },
  {
    id: 'fact2',
    from: 255,
    duration: 180,
    hue: 300,
    lines: [
      L("L'espace a une *ODEUR*", 0, 60, 'zoom'),
      L('Métal brûlé et *VIANDE GRILLÉE*', 60, 60, 'slide'),
      L('selon les *ASTRONAUTES*', 120, 60, 'zoom'),
    ],
  },
  {
    id: 'fact3',
    from: 435,
    duration: 180,
    hue: 200,
    lines: [
      L("Une cuillère d'*ÉTOILE À NEUTRONS*", 0, 60, 'zoom'),
      L('pèse *UN MILLIARD* de tonnes', 60, 60, 'slide'),
      L('Comme *100\u00A0000 TOURS EIFFEL*', 120, 60, 'zoom'),
    ],
  },
  {
    id: 'outro',
    from: 615,
    duration: 90,
    hue: 330,
    lines: [L('Et le 4e est *PIRE*…', 0, 40, 'zoom'), L('Abonne-toi pour la *PARTIE\u00A02*', 40, 50, 'slide')],
  },
];

export const TOTAL_FRAMES = SCENES[SCENES.length - 1].from + SCENES[SCENES.length - 1].duration;

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
