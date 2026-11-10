# Script — « 3 faits incroyables sur l'espace que personne ne t'a appris »

Format : 1080×1920, 30 fps, **23.9 s (717 images)**, voix off française. Mots en `*astérisques*` = surlignés en jaune.
Le minutage suit la durée réelle de chaque phrase de voix off (généré par `tools/voiceover.py` → `src/timing.json`).

| Temps | Scène | Texte à l'écran (≤ 6 mots) | Voix off |
|---|---|---|---|
| 0.0 – 1.2 s | hook | Personne ne t'a appris *ÇA* | « Personne ne t'a appris ça ! » |
| 1.2 – 2.6 s | hook | 3 faits *FOUS* sur l'*ESPACE* | « Trois faits fous sur l'espace. » |
| 2.6 – 4.9 s | fact1 | Une journée sur *VÉNUS* | « Numéro un : une journée sur Vénus » |
| 4.9 – 6.3 s | fact1 | dure plus qu'une *ANNÉE* | « dure plus longtemps qu'une année ! » |
| 6.3 – 9.2 s | fact1 | *243 JOURS* contre 225 ! | « Deux cent quarante-trois jours, contre deux cent vingt-cinq. » |
| 9.2 – 11.3 s | fact2 | L'espace a une *ODEUR* | « Numéro deux : l'espace a une odeur. » |
| 11.3 – 13.4 s | fact2 | Métal brûlé et *VIANDE GRILLÉE* | « Métal brûlé, et viande grillée ! » |
| 13.4 – 14.9 s | fact2 | selon les *ASTRONAUTES* | « C'est ce que racontent les astronautes. » |
| 14.9 – 17.3 s | fact3 | Une cuillère d'*ÉTOILE À NEUTRONS* | « Numéro trois : une cuillère d'étoile à neutrons » |
| 17.3 – 18.9 s | fact3 | pèse *UN MILLIARD* de tonnes | « pèse environ un milliard de tonnes. » |
| 18.9 – 20.5 s | fact3 | Comme *100 000 TOURS EIFFEL* | « Autant que cent mille tours Eiffel ! » |
| 20.5 – 22.1 s | outro | Et le 4e est *PIRE*… | « Et le quatrième est encore pire… » |
| 22.1 – 23.5 s | outro | Abonne-toi pour la *PARTIE 2* | « Abonne-toi pour la partie deux ! » |

Transitions : zoom et glissement en alternance à chaque phrase, flash + accélération des étoiles à chaque scène,
« punch » de zoom sur les phrases de plus de 2 s.

Éléments permanents : fond sombre en dégradé animé (teinte qui change par scène), champ d'étoiles en mouvement
(effet « vitesse lumière »), barre de progression jaune fine en haut.

Zone sûre : tout le texte est contenu dans x ∈ [70 ; 910] et y ∈ [180 ; 1650] (rien dans les 250 px du bas ni les 150 px de droite).

## Sources des faits (vérifiés)
1. Vénus : rotation sidérale ≈ 243 jours terrestres, révolution ≈ 225 jours (NASA). Nuance : le jour *solaire* (d'un lever de Soleil au suivant) dure ≈ 117 jours, car Vénus tourne à l'envers.
2. Odeur de l'espace : décrite par les astronautes (combinaisons et sas après sorties extravéhiculaires) comme « métal chaud, soudure, steak grillé ». On ne respire pas le vide : c'est l'odeur rapportée sur les équipements.
3. Étoile à neutrons : densité ≈ 10¹⁷ kg/m³ → une cuillère à café (≈ 5 cm³) ≈ 1 milliard de tonnes ≈ 100 000 tours Eiffel (≈ 10 000 t chacune).
