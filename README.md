# טדאם! (tadam)

Marketing landing page for **טדאם!**, a personalized live trivia game for bar and bat mitzvahs.
Astro (static) + TypeScript, GSAP + ScrollTrigger, Lenis smooth scroll, plain CSS custom properties.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
```

Deploy: Netlify picks up `netlify.toml` (build `npm run build`, publish `dist`).
Netlify site: `tadam-game` (https://tadam-game.netlify.app). `tadam.netlify.app` was already taken.

```bash
netlify deploy --dir dist          # draft preview
netlify deploy --dir dist --prod   # publish to tadam-game.netlify.app
```

## Theme

One theme, **Game Stage** (electric blue stage + glowing floor strip, matches the game screens),
driven by CSS variables in `src/styles/tokens.css`.

## Where to edit things

| What | File |
|---|---|
| All Hebrew copy (headlines, bubbles, FAQ, modal) | `src/content/copy.he.ts` |
| WhatsApp number + message | `src/config/site.ts` (now Ilan's number, temporary) |
| Logo (PNG + WebP, v4) | `public/brand/`, regenerate with `python tools/key-logo.py` from `assets-src/tadam-logo-v4-green.jpg` |
| Hero video loop (18s, no audio) | `public/demo/tadam-hero-loop.mp4` + poster |
| Drafts for review (noindex, not linked, blocked in robots.txt) | `src/pages/drafts/` (WhatsApp flow sample) |
| Colors / type scale / theme | `src/styles/tokens.css` |
| Analytics (currently a stub that pushes to `window.dataLayer`) | `src/lib/analytics.ts` |
| "Leave details" form (Netlify Forms, form name `lead`) | `src/components/LeadForm.astro`; submissions in Netlify → Forms; email alerts in Netlify → Forms → Form notifications |
| Production domain (canonical / OG URLs) | `astro.config.mjs` → `site` (also `public/robots.txt`) |
| Blog articles (one Markdown file each) | `src/content/blog/*.md`, schema in `src/content.config.ts` |
| Blog status, plan, playbook, sources | `docs/seo/` (start with `status.md`) |
| Keyword research script (DataForSEO) | `tools/seo/research.py` |

FAQ answers are marked `// TODO confirm` in `copy.he.ts`.

## Page structure

```
Scene 0  Hero (top bar + TV loop)  src/components/scenes/Scene0Hero.astro      scripts/hero.ts
Scene 1  The event (hall)     Scene1Event.astro                           scripts/scenes/scene1.ts
Scene 2  Memories (bubbles)   Scene2Insight.astro                         scripts/scenes/scene2.ts
Scene 3  WOW #1: buzzer+demo  Scene3Reveal.astro                          scripts/scenes/scene3.ts
Scene 4  How it's built       Scene4HowItWorks.astro (+ privacy strip)    scripts/scenes/scene4.ts
Scene 6  Lights + leaderboard  Scene6Payoff.astro                          scripts/scenes/scene6.ts
Scene 7  CTA                  Scene7Cta.astro                             scripts/scenes/scene7.ts
FAQ, Footer, DemoModal        src/components/
Blog                          src/pages/blog/ (index + [slug]), src/components/blog/, /llms.txt from src/pages/llms.txt.ts
Illustrations (SVG)           src/components/art/
```

`src/scripts/main.ts` boots everything: Lenis + ScrollTrigger (`src/lib/scroll.ts`), the hero intro,
then the scenes in page order (after the intro, one per task, so the main thread never blocks for long).

## The demo modal

- Opened by the buzzer and the "בואו לראות דמו" button at the end of the page, and by `/#demo` links (blog).
- Shows the full recording of a real game (`public/demo/tadam-demo.mp4`, Eyal's birthday) with native controls, playing with sound when opened by a click (muted if the browser blocks sound), and a "דברו איתנו!" WhatsApp button under it.
- Closes on Esc, click outside, and the close button (the video pauses). Focus is trapped inside while open.

## Accessibility & motion

- `prefers-reduced-motion`: no smooth scroll, no pinning or scrubbing; every scene renders its final "story" state with simple fades.
- All copy is real DOM text. Scene 3 demo video (`public/demo/`): muted autoplay only while on screen, never with sound, no autoplay with reduced motion (poster + play button); the mp4 is requested only when the scene is near the viewport. Buttons: play/pause, sound, full screen.
- Hebrew, RTL from the root (`<html lang="he" dir="rtl">`).

## Performance notes

Lighthouse mobile on the local production preview: about 80 to 88 (it varies run to run).
The local preview server adds about 0.5s of server response time, so re-check on the Netlify URL.
LCP is the hero logo, which paints when the preloader finishes. That is the cost of the preloader;
shorten `hero.ts` timings if needed.
