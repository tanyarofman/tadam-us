# Mobile demo and pricing sequences, November 28, 2026

Ilan requested that the mobile live-demo cards and price boxes replace one
another while swiping through the page, and that the testimonial section sit
closer to the middle of the screen. He explicitly requested production release.

The existing testimonial sequence is now a shared card-sequence module used by
Live Demos, Pricing and Testimonials. Mobile scrolling holds each card in the
same native sticky stage, pauses for reading, then replaces it with the next
card. Reverse scrolling restores the previous card. Two price cards use a
shorter scroll distance than the three-card sections.

Mobile pricing and demo cards have compact portrait and landscape styles so the
full content and link remain in view, including on a 320 x 568 phone. Inactive
cards are hidden and cannot cover the active link. Demo links retain their
individual destinations and new-tab behavior; both entire price cards still
open /create. Desktop retains the existing rows and reading pauses.

The mobile testimonial heading, card and rating summary are centered together
within the viewport, replacing the earlier top alignment. Quotes, portraits,
ratings, package content and schema are unchanged.

Reduced motion and no-JavaScript layouts retain all cards in normal flow.
Explicit section links keep the earlier fully revealed reading layout, including
its scroll pause. Resizing cleans up mobile styles and restores desktop rows.

Validation: production build and Astro check pass, with one existing Person.astro
hint. Browser checks cover card replacement, reverse scrolling, release, small
phones, landscape, desktop resizing, live-demo and pricing destinations, centered
testimonials, reduced motion and header/footer navigation. The older homepage
navigation test now accounts for the existing creation wizard's URL hash and
checks cross-page footer navigation from /refunds (the wizard has no site footer).
All 38 applicable checks pass across desktop Chrome/Firefox and mobile
Chrome/WebKit. The three mobile sections were visually reviewed in Chrome.
