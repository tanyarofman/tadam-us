# Replace Tom's homepage recording, November 26, 2026

Ilan asked to replace the video in both the homepage popup and scrolling section
with `Shtoot/output/tom-demo-recording/tadam-tom-demo-16x9.mp4` and publish it live.

The shared `demoMedia()` source now points to `/demo/tadam-tom-demo-16x9.mp4`.
This is an exact copy of the supplied H.264/AAC file: 1920 x 1080, 30 fps,
93.266 seconds, 48,639,429 bytes. SHA-256:
`c10bac488f9c50f5aac871b26412f53bf87ad67f2b78a6ad4a0df44e09027ff8`.
Its metadata already precedes the media payload for progressive playback, so
no re-encoding or remuxing was necessary. The new filename prevents the prior
100-second recording from being reused from a browser cache.

Both players use a matching JPEG poster extracted at three seconds. Their
intrinsic dimensions now match the 1080p recording. The popup still starts with
sound on click, and the scroll player still starts muted. The short synchronized
hero clips and all other playback behavior are unchanged.

Validation: production build and Astro check pass (one existing Person.astro
hint). The existing demo-player browser tests check both players' new source,
actual 1080p dimensions and 93.266-second duration, playback and sound state,
popup closing, scroll restoration and direct links. All 12 checks pass across
desktop Chrome/Firefox and mobile Chrome/WebKit.
