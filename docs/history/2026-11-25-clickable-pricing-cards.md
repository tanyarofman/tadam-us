# Clickable pricing cards, November 25, 2026

Ilan requested that the entire Basic and VIP price cards open the same link as
Start Now. Each card now uses one native anchor to the shared `/create` URL, with
Start Now styled inside it. This supports clicking anywhere, keyboard activation
and the browser's normal open-in-new-tab behavior without nested links or duplicate
analytics events. A visible focus outline surrounds the full card.

Validation: the existing navigation check clicks the price itself (outside the
Start Now button) on desktop Chromium/Firefox and mobile Chromium/WebKit. Astro
check and production build pass. Continues PR #54 and its deploy preview.

## Closing-section pause

During this work, Ilan also requested a pause for “So, who's Tadam worthy?”. The
closing CTA now uses the existing native sticky-pause behavior (50svh desktop,
28svh mobile), with its heading and button visible before the footer enters.
Reduced-motion mode skips the pause. Browser checks cover the held position,
heading/button visibility and keeping the footer below the viewport during the pause.
