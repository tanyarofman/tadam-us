# Tadam! (tadam-us)

Marketing site for **Tadam!**, a personalized live trivia game show for events, for the US and Europe (English only).
The Israeli Hebrew site is a separate repository, `tanyarofman/tadam-il` (heytadam.com).
Astro (static) + TypeScript, GSAP + ScrollTrigger, Lenis smooth scroll, plain CSS custom properties.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
```

Deploy: the Netlify project `tadam-us` is linked to this GitHub repo and builds with `netlify.toml` (build `npm run build`, publish `dist`).
The site is at https://tadamevents.com (Netlify DNS). The address is set in `site` in `astro.config.mjs` and in `public/robots.txt`.

- Merging to `main` deploys to production automatically.
- Every pull request gets a deploy preview at `deploy-preview-<number>--tadam-us.netlify.app`.
- Old `/en/...` addresses redirect to the same page at the root (`netlify.toml`).

## Theme

The site and opening logo animation share a smooth blue-to-navy gradient,
defined by `--page-gradient` in `src/styles/tokens.css`.

## Where to edit things

| What | File |
|---|---|
| All site copy (headlines, bubbles, FAQ, modal, blog frame) | `src/content/copy.en.ts` (read through `useCopy()` in `src/content/copy.ts`) |
| Blog articles | `src/content/blog/` |
| Privacy policy text | `src/pages/privacy.astro` |
| Contact link (Messenger, heytadam Facebook page), Facebook page, public email hey@tadamevents.com (forwards to Tanya + Ilan via Forward Email DNS records in Netlify DNS) | `src/config/site.ts` |
| Header/footer logo | `public/brand/tadam-logo-navigation.webp` (user-provided); other logos keep the original artwork |
| Logo (PNG + WebP, v4) | `public/brand/`, regenerate with `python tools/key-logo.py` from `assets-src/tadam-logo-v4-green.jpg` |
| Synchronized hero clips (~19s, no audio) | `public/demo/hero-screen-en-v2.mp4`, `public/demo/hero-phone-en-v2.mp4` and their posters, recorded from the Tom demo (`/tom-demo`). Paths: `demoMedia()` in `src/config/site.ts` |
| Colors / type scale / theme | `src/styles/tokens.css` |
| Analytics (currently a stub that pushes to `window.dataLayer`) | `src/lib/analytics.ts` |
| "Leave details" form (Netlify Forms, form name `lead`) | `src/components/LeadForm.astro`; submissions in Netlify → Forms; email alerts in Netlify → Forms → Form notifications |
| Production domain (canonical / OG URLs) | `astro.config.mjs` → `site` (also `public/robots.txt`) |
| Blog articles (one Markdown file each) | `src/content/blog/*.md`, schema in `src/content.config.ts` |
| Structured data (Organization, WebSite, Service, FAQPage) | `src/components/pages/Home.astro`; articles: `src/components/pages/BlogArticle.astro` |
| Blog status, plan, playbook, sources | `docs/seo/` (start with `status.md`) |
| Keyword research script (DataForSEO) | `tools/seo/research.py` |

Open decisions (contact route, prices in USD, About facts) are marked `TODO (Tanya)` in the code; see `docs/seo/status.md`.

## Page structure

```
Scene 0  Hero (TV + phone loops)  src/components/scenes/Scene0Hero.astro      scripts/hero.ts, scripts/synced-preview.ts
Live demos                   src/components/LiveDemos.astro
Scene 3  Event photo → logo → demo  Scene3Reveal.astro                   scripts/scenes/scene3.ts
Scene 4  How it's built       Scene4HowItWorks.astro                      scripts/scenes/scene4.ts
Scene 6  Leaderboard + winner  Scene6Payoff.astro                          scripts/scenes/scene6.ts
Hosts                        src/components/Hosts.astro
Basic + VIP packages         src/components/Pricing.astro
Scene 7  CTA                  Scene7Cta.astro                             scripts/scenes/scene7.ts
FAQ, Testimonials, ClosingCta, Footer, DemoModal  src/components/
Blog                          src/pages/blog/ (index + [slug]), src/components/blog/, /llms.txt from src/pages/llms.txt.ts
Illustrations (SVG)           src/components/art/
```

`src/scripts/main.ts` boots everything: Lenis + ScrollTrigger (`src/lib/scroll.ts`), the hero intro,
then the scenes in page order (after the intro, one per task, so the main thread never blocks for long).

The hero clips start only after the logo intro finishes and both clips can play. They pause together for buffering, an offscreen preview,
or a hidden tab, and restart together when either clip ends. Reduced motion keeps their posters still.
Run the playback tests with `node --experimental-strip-types --test tests/synced-preview.test.mjs`.

## The demo modal

- Opened by `/#demo` links (blog). The closing CTA's buzzer and demo button open Tom's playable demo (`/tom-demo`) in a new tab.
- Shows the full recording of a real game (`public/demo/tadam-demo-en.mp4`, Tom's 13th birthday) with native controls, playing with sound when opened by a click (muted if the browser blocks sound), and a "Let's get started" button under it.
- Closes on Esc, click outside, and the close button (the video pauses). Focus is trapped inside while open.

## Accessibility & motion

- `prefers-reduced-motion`: no smooth scroll, no pinning or scrubbing; every scene renders its final "story" state with simple fades.
- All copy is real DOM text. Scene 3 demo video (`public/demo/`): muted autoplay only while on screen, never with sound, no autoplay with reduced motion (poster + play button); the mp4 is requested only when the scene is near the viewport. Buttons: play/pause, sound, full screen.
- English, LTR (`<html lang="en" dir="ltr">`). Components read their text with `useCopy(Astro.url)` from `src/content/copy.ts`. Style rules marked `[dir="ltr"]` come from the bilingual days and still apply.

## Performance notes

Lighthouse mobile on the local production preview: about 80 to 88 (it varies run to run).
The local preview server adds about 0.5s of server response time, so re-check on the Netlify URL.
LCP is the hero logo, which paints when the preloader finishes. That is the cost of the preloader;
shorten `hero.ts` timings if needed.

## Homepage regression checks

`npm run check`, `npm run build`, and `npm test` run the type/build and media playback checks.
With a local server on port 4327 (`npm run dev -- --port 4327`), run `npm run test:browser`
for section navigation, pricing, demos, mobile layouts and reduced motion in Chromium, Firefox and WebKit.
Set `TEST_URL` to test another local or preview server. Install test browsers with
`npx playwright install chromium firefox webkit` when needed.

Header/footer section links jump to readable content. In particular, How It Works
settles into a three-card row on desktop and a full stack on mobile; normal scrolling
before using a section link retains the original staged animation.
