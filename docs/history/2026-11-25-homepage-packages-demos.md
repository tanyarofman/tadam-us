# 2026-11-25: homepage packages, demos and navigation

## Requested by Ilan

- Header/footer links should land on completely revealed sections.
- Replace six feature tiles with Basic ($59) and VIP ($99), both one-time purchases.
- Use the supplied logo in headers and footers only.
- Revise the creation steps and six existing FAQ answers.
- Add three fictional live demo cards and a Live Demos footer link.
- Add three temporary fictional testimonials after FAQ and before the closing CTA.

## Implemented

- Basic: ready-made host, 8 questions and a real-time leaderboard, 100 concurrent
  participants, 2 question edits, game link available for 30 days.
- VIP: custom host, 12 questions and a real-time leaderboard, 600 concurrent
  participants, 4 question edits, game link available for 120 days.
- Both Start Now buttons link to `/create`; no package query parameter or checkout
  change. The creation flow's settings will determine the eventual price.
- Removed the requested pricing paragraph; Refund Policy remains linked in pricing
  and the footer. Currency and tax wording remains in the cost FAQ as requested.
- Live Demos sits between Hosts and Pricing. The three provided absolute demo URLs
  open in new tabs. No new game implementation or proxy route was added.
- New sections use the existing reveal animations and sticky reading pauses.
- Testimonials are visibly labeled as fictional samples and have no review schema.
- The old privacy/terms product descriptions were updated only where the new
  packages conflict: 30/120-day retention, delivered-question editing, and permission
  for custom faces/voices. Corresponding source drafts were kept in sync.
- Homepage Service schema now lists both offers. FAQ schema uses the new copy.

## Navigation behavior

Normal scrolling retains the staged scenes. Explicit section navigation reveals the
content and jumps directly to its heading. How It Works settles into all three cards
at once, including a full mobile stack. Cross-page hashes wait for the intro, fonts
and scene initialization. Footer clicks use actual viewport scroll coordinates,
not Lenis's potentially stale cached position after native scrolling or a pin refresh.

## Assets

The attached logo is copied unchanged to `public/brand/tadam-logo-navigation.webp`.
The hero intro and other original scene logos remain unchanged. Demo assets and
source/generation details are in `docs/media/us-homepage-demo-cards.md`.

## Verification

- Astro type check: no errors or warnings (one existing Person.astro hint).
- Production build: 46 pages.
- Existing media playback tests: 8 passed.
- Browser regressions: 12 passed across desktop Chromium/Firefox and mobile
  Chromium/WebKit, including reduced motion, cross-page and footer links, packages,
  loaded demo assets, FAQ demo navigation and no horizontal overflow.
- Visual inspection: desktop How It Works, pricing, demos and header; mobile pricing,
  demos and testimonials.

## Still separate work

- `/create` remains the existing coming-soon page; this PR doesn't add checkout.
- Harry Potter and Simpsons demo games will be created later by Ilan.
- Replace the labeled sample testimonials with real approved content.
- Changes are prepared on a feature branch for a review PR. Production follows the
  repository's existing merge workflow; do not merge without the requested approval.
