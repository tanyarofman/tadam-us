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

## Authentic style block (round 2: the six guests and the kids)

Round 1 looked too polished and stock-like, with too many women. Round 2 is a candid, documentary look, 3 women and 3 men, mixed ages and skin tones:

> Candid documentary-style photograph of a real-looking ordinary person at a family party in Israel (fictional, not any real person, not a celebrity). Authentic and unretouched: natural skin with pores, fine lines, small asymmetries, flyaway hair, everyday ordinary (not model-like) face, real body type, slightly imperfect framing, a genuine unposed expression caught mid-moment. Everyday casual clothes that are a bit lived-in, not styled. Shot on a phone-quality full-frame camera, 35mm lens, mild grain, no beauty filter, no airbrushing, no glossy studio or stock-photo look. Mixed lighting from a party hall with a strong blue stage light on one side and a soft cyan rim, deep navy blue (#00176a to #030e3f) background with a few faint out-of-focus lights. Wholesome and family friendly. No text, no logos, no watermark, nothing readable.

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
| `kids-playing.webp` | 800x800 (square) | Scene 1 corner |
| `celebrant-stage.webp` | 600x800 | not placed yet (KidOnStage variant="celebrant") |
| `family-cheering.webp` | 800x800 (square) | not placed yet (spare) |
| `grandma-winning.webp` | 640x640 (square) | Scene 6 (matches the leaderboard winner) |

## Subjects (one per image)

### kids-playing.webp

Aspect ratio: 1:1. (Round 2, authentic style block.) Replaced `bored-kids` (kids sitting with phones looked depressing).

> Three kids standing side by side, two boys and one girl (about 12 to 13): laughing and cheering, each with one arm stretched up holding a smartphone above their head, as if scanning a code to join a game. Casual tees and hoodies, upper bodies and raised arms visible.

### guest-grandma.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A warm grandmother around 74, Mizrahi-Jewish look, short gray curly hair, deep laugh lines, simple glasses on a cord, patterned housedress under a knit cardigan, holding a phone close and squinting at it with a delighted grin.

### guest-aunt.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. An aunt around 46, olive skin, dark hair pulled back loosely with a clip, real tired-but-happy face, plain green t-shirt, laughing mid-sentence while gesturing with one hand, phone in the other.

### guest-bestfriend.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A 13 year old girl, Ethiopian-Israeli, braids tied up, hoodie and braces visible in a big grin, holding her phone up high with both hands, bouncing with excitement.

### guest-cousin.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A 16 year old boy, slightly awkward teenage look, a little acne, messy curly hair, oversized gray t-shirt, half-smirk, thumbs on a phone held in front of him.

### guest-dad.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A dad around 50, balding with graying stubble, a bit of a belly under a wrinkled light button-up shirt, covering his mouth with one hand while laughing, embarrassed, remembering a story.

### guest-teacher.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A male teacher around 40, Ashkenazi look, beard, thin-framed glasses, rolled-up sleeves on a casual blue shirt, friendly amused smile, holding a phone at chest height.

### hall-crowd.webp

Aspect ratio: 16:9 wide.

> Wide shot of a party hall from behind and above the crowd, about 40 mixed-age guests seen from behind and in silhouette, many holding up glowing phones lit cool blue, a big glowing blue screen at the far end, vertical blue light beams, faces not identifiable, no one looks at the camera.

### guest-grandma.webp

Aspect ratio: 3:4 portrait. (Round 2: use the **authentic style block** below, not the shared one.)

> Waist-up. A warm grandmother around 74, Mizrahi-Jewish look, short gray curly hair, deep laugh lines, simple glasses on a cord, patterned housedress under a knit cardigan, holding a phone close and squinting at it with a delighted grin.

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
