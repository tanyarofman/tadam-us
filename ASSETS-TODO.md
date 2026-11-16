# Assets TODO

People are now photoreal, fictional, generated images in `public/people/` (see `docs/people-image-prompts.md`). The rest is SVG + CSS/GSAP.
These are the spots where a dedicated illustration, generated image or video would clearly lift the page.
Each one has a clearly named component, so it can be swapped without touching the scene logic.

| # | Where | Component today | What's needed |
|---|---|---|---|
| 1 | Scene 1, the hall (DONE: `hall-crowd.webp`) | `src/components/art/HallArt.astro` | ~~A wide, stylized bat mitzvah hall illustration (round tables, DJ booth with colored beams, a big dark screen on the wall, string lights). Same flat style: thick `#330768` outlines, flat fills, soft gradients. Must work cropped to a 9:19 phone frame (keep the DJ centered). Ideally layered (background / tables / DJ / beams) for parallax.~~ Replaced by a photo slot. |
| 2 | Scene 1, bored kids corner (DONE: `kids-playing.webp`) | `.kids-corner` in `HallArt.astro` | 3 kids standing, laughing, phones held up to join the game. |
| 3 | Scene 2, guests (DONE: 6 `guest-*.webp`) | `src/components/art/Guest.astro` | A set of 6 characters (grandma, aunt, best friend, cousin, dad, teacher) in one consistent style, front-facing, transparent background. Could become short looping Lottie/video loops (talking, laughing). |
| 4 | Scene 3, the demo video (DONE: `public/demo/tadam-demo.mp4` + poster, replaces the host carousel) | `src/components/scenes/Scene3Reveal.astro` | Ideally a purpose-made demo recording later: no `base44.app` URL in the phone status bar, no cartoon or family media. Keep 16:9 (1252x720) so the frame does not shift. |
| 5 | Scene 5, crowd of phones | canvas in `scripts/scenes/scene5.ts` | Optional: a short dark video loop of a real hall from above with phones lighting up (no identifiable faces), to sit behind the canvas. |
| 6 | Scene 6, the winner on stage (DONE: `grandma-winning.webp`; spare `celebrant-stage.webp`) | `src/components/art/KidOnStage.astro` | Photo of the fictional winner (סבתא רחל) with mic and crown. |
| 7 | Social share image | `og:image` in `src/layouts/Base.astro` (uses the logo PNG now) | 1200x630 OG image: logo + headline on the Purple Night stage. |
| 8 | Favicon | `src/layouts/Base.astro` (uses the logo PNG now) | Square icon: the red buzzer alone, 512x512 PNG + SVG. |
| 9 | Optional 3D buzzer | `src/components/Buzzer.astro` | The spec allows a Three.js buzzer if under ~250 KB. Current SVG buzzer keeps the page fast; a pre-rendered short video/WebP sequence of the buzzer press could be a lighter "3D" upgrade. |

## Photo slots

Every person image is a `src/components/art/Person.astro` slot: `<img src="/people/<name>.webp">` with Hebrew alt, width/height, lazy loading, and a blue silhouette placeholder until the file exists. To swap an image, overwrite the file (same name, same aspect ratio). Spare images not placed yet: `celebrant-stage.webp`, `family-cheering.webp`. Scene 5 crowd backdrop (item 5) is still the canvas.
