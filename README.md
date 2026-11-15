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

## Switch themes

Two themes, both driven by CSS variables in `src/styles/tokens.css`:

| URL | Theme |
|---|---|
| `/?theme=night` (default) | **Purple Night**: deep purple, warm yellow spotlights |
| `/?theme=stage` | **Game Stage**: electric blue stage + glowing floor strip, matches the game screens |

There is also a small floating **Purple Night / Game Stage** switch (top-left) for comparing live.
Hide it before launch: `showThemeSwitch: false` in `src/config/site.ts`.

## Where to edit things

| What | File |
|---|---|
| All Hebrew copy (headlines, bubbles, FAQ, modal) | `src/content/copy.he.ts` |
| Demo links to the Base44 game | `src/config/demo.ts` |
| WhatsApp number + message, theme switch toggle | `src/config/site.ts` |
| Colors / type scale / both themes | `src/styles/tokens.css` |
| Analytics (currently a stub that pushes to `window.dataLayer`) | `src/lib/analytics.ts` |
| Production domain (canonical / OG URLs) | `astro.config.mjs` → `site` |

FAQ answers are marked `// TODO confirm` in `copy.he.ts`.

## Page structure

```
Scene 0  Hero + preloader     src/components/scenes/Scene0Hero.astro      scripts/hero.ts
Scene 1  The event (hall)     Scene1Event.astro                           scripts/scenes/scene1.ts
Scene 2  Memories (bubbles)   Scene2Insight.astro                         scripts/scenes/scene2.ts
Scene 3  WOW #1: buzzer+host  Scene3Reveal.astro                          scripts/scenes/scene3.ts
Scene 4  How it's built       Scene4HowItWorks.astro (+ privacy strip)    scripts/scenes/scene4.ts
Scene 5  WOW #2: the moment   Scene5Moment.astro                          scripts/scenes/scene5.ts
Scene 6  Leaderboard payoff   Scene6Payoff.astro                          scripts/scenes/scene6.ts
Scene 7  CTA                  Scene7Cta.astro                             scripts/scenes/scene7.ts
FAQ, Footer, DemoModal        src/components/
Illustrations (SVG)           src/components/art/
```

`src/scripts/main.ts` boots everything: Lenis + ScrollTrigger (`src/lib/scroll.ts`), the hero intro,
then the scenes in page order (after the intro, one per task, so the main thread never blocks for long).

## The demo modal

- Desktop: QR code of `DEMO.joinUrl` (generated client-side) + the big-screen view.
- **The Base44 host page currently sends `X-Frame-Options: DENY`**, so it cannot be shown in an iframe.
  While `DEMO.hostEmbeddable` is `false`, the modal shows a "פתחו את המסך הגדול בלשונית חדשה" button instead.
  If the partner allows framing (`Content-Security-Policy: frame-ancestors https://<landing-domain>`), flip it to `true`;
  a load timeout still falls back to the button.
- Until `joinUrl` is set, the QR box shows a "coming soon" placeholder.
- Mobile: "שחקו על הטלפון הזה" opens `soloUrl`, else `joinUrl`, else `hostUrl`; "שלחו לי לינק למחשב" opens a WhatsApp share.
- Closes on Esc, click outside, and the close button. Focus is trapped inside while open.

## Accessibility & motion

- `prefers-reduced-motion`: no smooth scroll, no pinning or scrubbing; every scene renders its final "story" state with simple fades.
- All copy is real DOM text. Sound: none (nothing autoplays).
- Hebrew, RTL from the root (`<html lang="he" dir="rtl">`).

## Performance notes

Lighthouse mobile on the local production preview: about 80 to 88 (it varies run to run).
The local preview server adds about 0.5s of server response time, so re-check on the Netlify URL.
LCP is the hero logo, which paints when the preloader finishes. That is the cost of the preloader;
shorten `hero.ts` timings if needed.
