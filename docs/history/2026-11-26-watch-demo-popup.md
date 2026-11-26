# Watch the demo popup, November 26, 2026

Ilan requested that the hero's "Watch the demo" open the existing video dialog,
start with sound, show "Demo Video" without the explanatory caption, avoid the
yellow outline on the close button when opening, and return to the previous
screen when closed. The separate scrolling demo keeps its existing behavior.

The hero link now uses data-open-demo and href="#demo" with its existing modal
analytics event, instead of the scene-3 scrolling link. Initial focus goes to
the dialog heading, while keyboard users still get a visible focus indicator
when they Tab to Close. Closing pauses the recording and restores the saved
scroll position and trigger focus without scrolling; the explicit trigger also
handles Safari's tap-focus behavior. A pending rejected play request cannot
restart the recording after close. The intro and modal own separate scroll
locks so finishing the intro does not unlock an open /#demo dialog.

Ilan clarified that the recording must be Tom's demo from heytadam.com/en/.
The local public/demo/tadam-demo-en.mp4 is an exact byte match to
https://heytadam.com/demo/tadam-demo-en.mp4 (6,439,927 bytes, SHA-256
8400094cd4b7a376c68dff13cc925501026c668813bfbefd6e58d5147c7080f2).
Both the popup and scrolling demo continue using that same existing asset.

Click/tap playback starts unmuted in Chrome desktop/mobile, Firefox and WebKit
mobile. A direct /#demo visit without user interaction retains the existing
muted fallback if the browser blocks sound. Browser preferences can still block
autoplay; native video controls remain available.

Validation: production build passes, Astro check has no errors or warnings
(one pre-existing Person.astro hint), and all 12 popup browser checks pass across
four browser configurations. Checks cover sound, title/caption, initial focus,
close/scroll restoration, deep links, keyboard closing, scroll locks and delayed
play rejection. The popup was also visually reviewed in the browser.
All eight existing desktop/mobile homepage checks also pass, covering section
navigation, reduced motion, assets and scroll pauses.

Production publishing remains blocked by Netlify team credits; rechecked the
Netlify deploys page during this work. The live site is still main@092ebee and
the previous main@5268359 deployment was skipped. No billing changes were made.

References:
- https://developer.chrome.com/blog/autoplay/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
