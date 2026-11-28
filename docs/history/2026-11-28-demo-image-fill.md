# Demo image width correction, November 28, 2026

Ilan reported a blank strip beside the mobile demo artwork after the card
sequence release (PR #85). This correction continues that authorized production
release.

Reproduced in mobile WebKit: the photo's aspect ratio and maximum height reduced
its automatic width below the card width (a 30-pixel gap at 320 x 568). Giving the
photo container an explicit 100% width fills its flex or grid slot while keeping
the compact height and existing cover crop, badge and play button.

The existing small-phone browser check now measures the photo and image against
their available width and height for all three demos, with an additional
375 x 650 viewport. It fails before the fix and passes afterward in mobile
WebKit and Chrome, including 320 x 568 portrait and 844 x 390 landscape. The
production build passes, and the corrected birthday card was visually reviewed
at 375 x 650 in Chrome.
