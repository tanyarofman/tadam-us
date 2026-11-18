# Host image update — 18 November 2026

Mode: built-in imagegen, image edit. Final generated asset: `public/people/custom-host-avatars.webp` (1536 × 1024), previously displayed as six circular avatars from a 3 × 2 sheet. This custom-persona block was subsequently removed; the asset and prompts are retained as design history.

## First edit

Use case: precise-object-edit. Input image is the existing six custom-host portrait examples for a trivia website. Keep the identity, clothing, smile and natural photographic style of Albert Einstein, the silver-haired aunt with colorful glasses, Keanu Reeves, and the cheerful bearded man with the colorful shirt. Replace the female CEO with recognizable Mark Zuckerberg wearing a simple dark crewneck shirt, friendly relaxed smile. Replace the current screen-faced robot with an original charming Pixar-style 3D animated robot character: rounded sculpted head, expressive large inset eyes, small physical smiling mouth, ivory and warm orange metal, playful personality, polished cinematic materials, not a black screen face.
Recompose the six portraits into a perfectly regular contact sheet of 3 columns by 2 rows, each cell exactly square, all cells equal size, no gaps, no borders and no text. Overall canvas aspect ratio 3:2. Order: top left Einstein, top middle aunt, top right Keanu; bottom left Zuckerberg, bottom middle party-shirt man, bottom right robot. Every portrait must be suitable for a circular avatar crop: show the whole head including all hair/ears and robot head, centered with generous empty space above and beside it. Each entire head occupies only about 55–60% of its square, with shoulders and upper chest visible below, no cropped hair. Keep all important facial details within a central circle covering 85% of the square. Soft studio light. Cohesive alternating cobalt-blue and dark-violet backgrounds as in the reference. These are illustrative host concepts, no endorsement symbols, no text or logos.

## Final edit following the user's portrait corrections

Use case: precise-object-edit. Edit this exact 3-column by 2-row contact sheet of square host portraits. Change ONLY these three cells: top middle, top right, bottom middle.
Top middle: replace the older silver-haired woman with an original friendly woman around 35, warm olive skin, shoulder-length natural dark curly hair, simple coral blouse, no glasses, relaxed smile.
Top right: replace Keanu Reeves with recognizable Gal Gadot, friendly warm smile, dark shoulder-length hair, simple elegant black outfit, natural photographic portrait.
Bottom middle: replace the floral-shirt man with an original Israeli man around age 50, short salt-and-pepper hair, subtle neatly trimmed stubble, casual dark navy button-up shirt, warm approachable smile; no floral pattern, no celebrity likeness.
PRESERVE top-left Albert Einstein, bottom-left Mark Zuckerberg and bottom-right the ivory-and-orange Pixar-style robot exactly as they are, including their framing, faces and clothing. Preserve the sheet size, perfectly aligned 3x2 grid, square cell boundaries, blue/violet backgrounds and lighting. All heads fully visible with generous breathing room, shoulders in frame, all face/head details inside the central 85% circle of each cell for circular-avatar clipping. No text, no logos, no endorsement symbols.

The final generated PNG was encoded as WebP at quality 90 with no retouching. The source PNG remains in the generated-images folder.

## Supplied host photographs

The user's files were copied unchanged:

- Desktop/2.webp → `public/people/host-classic-waist.webp`
- Desktop/1.webp → `public/people/host-friendly-waist.webp`
- Desktop/3.webp → `public/people/host-animated-waist.webp`

The component crops them from the waist up using CSS, preserving the supplied image files.

The final host section centers the three supplied portraits and headings in the viewport, with additional headroom inside each card. The line `(ואפשר גם ליצור מנחה משלכם!)` appears below the row.
