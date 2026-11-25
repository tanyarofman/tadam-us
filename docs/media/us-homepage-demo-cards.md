# US homepage demo cards (2026-11-25)

The three cards illustrate fictional events, as requested by Ilan. Their links
open in new tabs; this change does not implement the games.

## Assets

| File in `public/demo/events/` | Source |
| --- | --- |
| `friends-wedding.webp` | Built-in imagegen; generated fictional wedding portrait of Monica and Chandler. Original PNG retained locally under the Codex generated-images directory. |
| `harry-potter-birthday.webp` | [Harry Potter official character page](https://www.harrypotter.com/fact-file/characters-and-pets/harry-potter), image of Harry at the Great Hall table in film 6. |
| `homer-retirement.webp` | [Frinkiac, S19E08 at 1226392 ms](https://frinkiac.com/caption/S19E08/1226392), Homer celebrating beside a cake. |

The Harry and Homer pictures illustrate the fictional demo cards; they are not
stills of the named fictional events. Character artwork remains with its respective
rights holders. The image generator rejected the Harry and Homer requests; existing
images were used instead. All three are local WebP assets (no third-party image requests).

Source image URLs:

- https://contentful.harrypotter.com/usf1vwtuqyxm/6fjvdemYmo7kJ2V5P5Xqhc/1fc2b0b396123f891e858069e00d0d2b/hp-f6-harry-at-great-hall-table-web-fact-file-image.jpg?fm=jpg&q=85&w=1280
- https://frinkiac.com/img/S19E08/1226392.jpg

## Generation prompt (built-in imagegen)

Use case: photorealistic-natural. Asset type: landscape 16:9 image for an event trivia demo card, no lettering or logos. Primary request: Monica Geller and Chandler Bing from Friends at their wedding reception, a joyful candid waist-up wedding portrait of the fictional couple together, Monica in her wedding dress and Chandler in a dark suit. Warm candlelit reception background, soft fairy lights, flowers, rich natural colors, happy and inviting. Keep both faces clear and centered with room around them for a 16:9 card crop. An imaginative fictional scene, high-quality editorial photo look. No text, no watermark.

## Navigation logo

`public/brand/tadam-logo-navigation.webp` is an unchanged copy of Ilan's attached
`1.webp` (894 × 394, with alpha). Only header and footer components use it.
The original intro and scene logos remain unchanged.
