# Homepage review revisions, November 25, 2026

Follow-up to PR #54, requested by Ilan with Frame 29.png and 5.webp / 6.webp / 7.webp.

- Pricing now follows the mockup: colored price and tier badge, divider, checkmarked
  features, compact Start Now button. Keep Basic $59 and VIP $99 with their existing
  package limits; the mockup's duplicated VIP price/features are visual placeholders.
- Heading: "One price, the whole show." with a magenta underline under "whole show".
  Subtitle: "Everything you need for a full game at your event."
- Remove only the pricing Refund Policy link. The footer and FAQ links remain.
- Live Demos is directly before the "Every event..." scene and comes first in the
  header navigation. Its "live demo" phrase has a magenta underline.
- Increase the demos reading hold from 50svh to 90svh on desktop,
  and from 28svh to 50svh on mobile. On tall mobile stacks, pause with the last card visible
  before the next section enters. Reduced-motion mode has no sticky hold.
- Replace all three demo photos with the supplied files. Rename the birthday demo
  to Eleven's 18th Birthday and link `/stranger-things-demo`; retirement is now
  Homer's Retirement Party. Wedding and retirement destinations are unchanged.
- Use the exact requested Emily/Marcus quotes and all three event labels. Sophie's
  quote remains unchanged. Remove the public sample notice as explicitly requested.
- Generate three natural-looking, original fictional persona portraits using built-in
  imagegen. These remain placeholder testimonials, not verified customer evidence;
  source notes and prompts are in `docs/media/homepage-persona-portraits.md`.

## Verification

- 16 browser checks passed across desktop Chromium/Firefox and mobile Chromium/WebKit,
  including direct hashes, header/footer/cross-page navigation, images, reduced motion,
  and a measured reading pause that keeps the demo cards visible while scrolling.
- 8 media tests passed. Astro check: zero errors/warnings, one pre-existing hint.
- Production build: 46 pages.
- Visual review: desktop pricing/demos/header, mobile pricing/testimonials.

Continues the existing PR and preview; production merge workflow is unchanged.
