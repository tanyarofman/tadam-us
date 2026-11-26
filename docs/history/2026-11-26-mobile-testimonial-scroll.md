# Mobile testimonial sequence, November 26, 2026

Ilan requested that mobile testimonials replace one another while scrolling,
like the How it works cards. The three supplied customer reviews now share a
native sticky stage on phones, with a reading pause for each review, a flip-in
transition, and reverse playback when scrolling back. The section releases
after Susan's review. Desktop retains the three-column layout and existing pause.

The heading and existing 5/5 summary stay visible above and below the active
review. Quotes, photos, names, ratings and Game review schema are unchanged.
Compact portrait and landscape styles keep the full quote and author readable.
Reduced motion, no JavaScript and direct /#testimonials navigation retain the
complete reading layout. Resizing clears the mobile transforms and visibility.

Validation: production build and Astro check pass (one existing Person.astro
hint). Ten focused browser checks pass across Chrome, Firefox, mobile Chrome
and mobile WebKit: scroll replacement, reverse scrolling, release, 320px phones,
landscape rotation, desktop resizing, direct links and reduced motion. The
14 homepage and demo-popup regression checks also pass on desktop Chrome and
mobile WebKit. Visually reviewed the mobile cards in Chrome.

This follows the homepage production changes authorized in this chat. Netlify
production was previously blocked by exhausted team credits, but the dashboard
now confirms production main@13685d0 was published on November 26. No billing
changes were made in this session.

PR: https://github.com/tanyarofman/tadam-us/pull/68
Preview: https://deploy-preview-68--tadam-us.netlify.app/
