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

Deploy: the Netlify site `heytadam` (formerly `tadam-game`, custom domain https://heytadam.com) is linked to this GitHub repo and builds with `netlify.toml` (build `npm run build`, publish `dist`).

- Merging to `main` deploys to production automatically.
- Every pull request gets a deploy preview at `deploy-preview-<number>--heytadam.netlify.app`.

## Theme

The site and opening logo animation share a smooth blue-to-navy gradient,
defined by `--page-gradient` in `src/styles/tokens.css`.

## Where to edit things

| What | File |
|---|---|
| All Hebrew copy (headlines, bubbles, FAQ, modal) | `src/content/copy.he.ts` |
| The English translation of it (`/en/`), same keys | `src/content/copy.en.ts` |
| Blog articles | `src/content/blog/` (Hebrew), `src/content/blog-en/` (English translation, same file name) |
| Privacy policy text | `src/pages/privacy.astro` (Hebrew), `src/pages/en/privacy.astro` (English) |
| Contact link (Messenger, heytadam Facebook page), Facebook page, public email hey@heytadam.com (forwards to Tanya + Ilan via Forward Email DNS records in Netlify DNS) | `src/config/site.ts` |
| Logo (PNG + WebP, v4) | `public/brand/`, regenerate with `python tools/key-logo.py` from `assets-src/tadam-logo-v4-green.jpg` |
| Synchronized hero clips (~19s, no audio) | `public/demo/hero-screen.mp4` (a.mp4), `public/demo/hero-phone.mp4` (b.mp4), and their JPEG posters. English (`/en/`): the same names with `-en`, recorded from the Tom demo (`/tom-demo`). Paths per language: `demoMedia()` in `src/config/site.ts` |
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
Scene 0  Hero (TV + phone loops)  src/components/scenes/Scene0Hero.astro      scripts/hero.ts, scripts/synced-preview.ts
Scene 3  Event photo → logo → demo  Scene3Reveal.astro                   scripts/scenes/scene3.ts
Scene 4  How it's built       Scene4HowItWorks.astro                      scripts/scenes/scene4.ts
Scene 6  Leaderboard + winner  Scene6Payoff.astro                          scripts/scenes/scene6.ts
Hosts                        src/components/Hosts.astro
What's included              src/components/Pricing.astro
Scene 7  CTA                  Scene7Cta.astro                             scripts/scenes/scene7.ts
Contact, FAQ, ClosingCta, Footer, DemoModal  src/components/
Blog                          src/pages/blog/ (index + [slug]), src/components/blog/, /llms.txt from src/pages/llms.txt.ts
Illustrations (SVG)           src/components/art/
```

`src/scripts/main.ts` boots everything: Lenis + ScrollTrigger (`src/lib/scroll.ts`), the hero intro,
then the scenes in page order (after the intro, one per task, so the main thread never blocks for long).

The hero clips start only after the logo intro finishes and both clips can play. They pause together for buffering, an offscreen preview,
or a hidden tab, and restart together when either clip ends. Reduced motion keeps their posters still.
Run the playback tests with `node --experimental-strip-types --test tests/synced-preview.test.mjs`.

## The demo modal

- Opened by `/#demo` links (blog). The closing CTA's buzzer and "שחקו בדמו" button open Eyal's playable demo in a new tab.
- Shows the full recording of a real game (`public/demo/tadam-demo.mp4`, Eyal's birthday) with native controls, playing with sound when opened by a click (muted if the browser blocks sound), and a "בואו נתחיל" Messenger button under it.
- Closes on Esc, click outside, and the close button (the video pauses). Focus is trapped inside while open.

## Accessibility & motion

- `prefers-reduced-motion`: no smooth scroll, no pinning or scrubbing; every scene renders its final "story" state with simple fades.
- All copy is real DOM text. Scene 3 demo video (`public/demo/`): muted autoplay only while on screen, never with sound, no autoplay with reduced motion (poster + play button); the mp4 is requested only when the scene is near the viewport. Buttons: play/pause, sound, full screen.
- Hebrew, RTL from the root (`<html lang="he" dir="rtl">`). The English version under `/en/` is the same page in LTR (`lang="en" dir="ltr"`): components read their text with `useCopy(Astro.url)` from `src/content/copy.ts`, and LTR-only style tweaks are marked `[dir="ltr"]`.

## Performance notes

Lighthouse mobile on the local production preview: about 80 to 88 (it varies run to run).
The local preview server adds about 0.5s of server response time, so re-check on the Netlify URL.
LCP is the hero logo, which paints when the preloader finishes. That is the cost of the preloader;
shorten `hero.ts` timings if needed.
