# People images: prompts and how they were made

All 11 images in `public/people/` are **fictional, AI-generated** people (Gemini image model `gemini-2.5-flash-image`
through the Gemini API, one call per image, square 1024 output, then cropped and converted to webp).
Rules: never a real person's likeness, no celebrities, no recognizable characters, event-neutral (mixed ages, casual clothing, phones),
no logos or readable text, children look like children at a party, nothing sexualized.

## Re-generating or replacing an image

Paste the **subject** line plus the **shared style block** into Gemini (any image model), ask for the aspect ratio shown, then
crop to the size in the table, save as webp (about 60 to 150 KB) and overwrite `public/people/<file>.webp`. No code change needed:
each slot is a `Person` component (`src/components/art/Person.astro`) that shows a blue silhouette until the file exists.

**Consistency tip:** keep the shared style block identical for every image (same "photographer": 50mm f/2, electric blue key light,
cyan rim, navy bokeh background), and generate the set in one sitting.

## Shared style block (append to every subject)

> Photorealistic candid photograph of fictional people, not any real person, no celebrities. Shot on a full-frame camera, 50mm lens at f/2, shallow depth of field, natural skin texture, soft film grain. Lighting: electric blue stage light with a soft cyan rim light, deep navy blue (#00176a to #030e3f) blurred party background with faint out-of-focus lights. Casual party clothing, wholesome, family friendly. No text, no logos, no watermark, no readable writing anywhere.

## The set

| File (`public/people/`) | Final size | Used in |
|---|---|---|
| `guest-grandma.webp` | 600x800 | Scene 2 |
| `guest-aunt.webp` | 600x800 | Scene 2 |
| `guest-bestfriend.webp` | 600x800 | Scene 2 |
| `guest-cousin.webp` | 600x800 | Scene 2 |
| `guest-dad.webp` | 600x800 | Scene 2 |
| `guest-teacher.webp` | 600x800 | Scene 2 |
| `hall-crowd.webp` | 1280x720 | Scene 1 background |
| `bored-kids.webp` | 900x600 | Scene 1 corner |
| `celebrant-stage.webp` | 600x800 | not placed yet (KidOnStage variant="celebrant") |
| `family-cheering.webp` | 800x800 (square) | not placed yet (spare) |
| `grandma-winning.webp` | 640x640 (square) | Scene 6 (matches the leaderboard winner) |

## Subjects (one per image)

### guest-grandma.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of a warm laughing grandmother around 72, silver hair in a loose bun, round glasses, cozy cream knit cardigan over a floral blouse, holding a smartphone in one hand, looking at the camera with a delighted mischievous smile.

### guest-aunt.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of an aunt around 45, shoulder-length wavy dark brown hair, teal blouse, big laugh, one hand raised mid-gesture as if telling a story, other hand holding a phone.

### guest-bestfriend.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of a 13 year old girl, best friend of the celebrant, long light-brown hair, yellow hoodie, playful excited grin, holding a phone up near her face, wholesome child at a party.

### guest-cousin.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of a 15 year old boy, curly dark hair, light blue t-shirt, cheeky smirk, holding a phone in both hands, relaxed teenage cousin at a party.

### guest-dad.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of a dad around 48, short brown hair with light stubble, red casual button-up shirt with rolled sleeves, hands clasped, embarrassed but affectionate laugh as if remembering a funny story.

### guest-teacher.webp

Aspect ratio: 3:4 portrait.

> Waist-up portrait of a teacher around 38, light brown hair in a bun, round glasses, soft lavender cardigan, kind amused smile, holding a phone.

### hall-crowd.webp

Aspect ratio: 16:9 wide.

> Wide shot of a party hall from behind and above the crowd, about 40 mixed-age guests seen from behind and in silhouette, many holding up glowing phones lit cool blue, a big glowing blue screen at the far end, vertical blue light beams, faces not identifiable, no one looks at the camera.

### bored-kids.webp

Aspect ratio: 3:2 wide.

> Three bored 11 to 13 year old kids slumped on chairs at the edge of a party hall, each staring at a smartphone, the cool blue phone glow lighting their faces, dull expressions, casual t-shirts and hoodies, dark navy background.

### celebrant-stage.webp

Aspect ratio: 3:4 portrait.

> A 13 year old girl celebrant on a stage laughing out loud, holding a microphone, wearing a small sparkly tiara and a casual party dress, colorful confetti in the air, spotlight from behind in electric blue, joyful and wholesome.

### family-cheering.webp

Aspect ratio: 16:9 wide.

> A family of mixed ages (grandparents, parents, kids) standing together cheering and laughing with arms up, looking toward a big glowing blue screen off-frame, phones in hand, seen from the front in a party hall.

### grandma-winning.webp

Aspect ratio: 3:4 portrait.

> A 72 year old grandmother with silver hair in a bun and round glasses laughing joyfully on a small stage, holding a microphone in one hand and the other fist raised in victory, a small golden paper crown on her head, confetti falling, cardigan and pearl necklace.

Check each result for: extra fingers, garbled phone screens, any text or logo, a face that resembles a known person. Regenerate if any.
