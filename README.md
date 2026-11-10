# tiktok-video

Vidéo TikTok verticale (1080×1920, 30 fps, 23,5 s) générée entièrement par code avec Remotion.

- Script et minutage : `SCRIPT.md`
- Rendu : `npm install && npm run render` → `out/tiktok.mp4`
- Aperçu interactif : `npm run studio`

Structure : `src/script.ts` (textes + minutage), `src/scenes/*` (une scène par composant),
`src/components/*` (fond étoilé, sous-titres mot par mot, barre de progression, habillage de scène).
