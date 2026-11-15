# Assets TODO

Everything on the page today is built from SVG + CSS/GSAP (no stock or generated images).
These are the spots where a dedicated illustration, generated image or video would clearly lift the page.
Each one has a clearly named component, so it can be swapped without touching the scene logic.

| # | Where | Component today | What's needed |
|---|---|---|---|
| 1 | Scene 1, the hall | `src/components/art/HallArt.astro` | A wide, stylized bat mitzvah hall illustration (round tables, DJ booth with colored beams, a big dark screen on the wall, string lights). Same flat style: thick `#330768` outlines, flat fills, soft gradients. Must work cropped to a 9:19 phone frame (keep the DJ centered). Ideally layered (background / tables / DJ / beams) for parallax. |
| 2 | Scene 1, bored kids corner | `.kids-corner` in `HallArt.astro` | 3 kids slumped on chairs staring at phones, blue phone glow on faces. Transparent background, about 330x210. |
| 3 | Scene 2, guests | `src/components/art/Guest.astro` | A set of 6 characters (grandma, aunt, best friend, cousin, dad, teacher) in one consistent style, front-facing, transparent background. Could become short looping Lottie/video loops (talking, laughing). |
| 4 | Scene 3, host silhouettes | `src/components/art/HostSlot.astro` | 4 **generic** silhouettes by type: singer with mic, athlete with ball, made-up cartoon creature, creator with phone + ring light. Must NOT resemble any real person or known character. Rim-lit in cyan. |
| 5 | Scene 5, crowd of phones | canvas in `scripts/scenes/scene5.ts` | Optional: a short dark video loop of a real hall from above with phones lighting up (no identifiable faces), to sit behind the canvas. |
| 6 | Scene 6, the kid on stage | `src/components/art/KidOnStage.astro` | The fictional kid (נועה) laughing on stage with a mic, tiara, confetti. Illustrated, not a photo. |
| 7 | Social share image | `og:image` in `src/layouts/Base.astro` (uses the logo PNG now) | 1200x630 OG image: logo + headline on the Purple Night stage. |
| 8 | Favicon | `src/layouts/Base.astro` (uses the logo PNG now) | Square icon: the red buzzer alone, 512x512 PNG + SVG. |
| 9 | Optional 3D buzzer | `src/components/Buzzer.astro` | The spec allows a Three.js buzzer if under ~250 KB. Current SVG buzzer keeps the page fast; a pre-rendered short video/WebP sequence of the buzzer press could be a lighter "3D" upgrade. |
