# 2026-11-25: Simpsons demo on tadamevents.com

Ilan requested the playable Homer Simpson retirement demo at
https://tadamevents.com/the-simpsons-demo.

Added the same Base44 proxy used by the existing demos. The shared host, guest
and media routes already preserve this domain, and the game backend already
accepts tadamevents.com for both its primary and backup connections. The game
uses the latest supplied WebP placeholder and the existing generated videos.

This route is separate from the homepage packages/demos feature branch. No
homepage copy or layout changes are included.

Validation: production build, redirect checks, and live host/participant checks.
The full gameplay verification reports are kept in the game workspace at
`Shtoot/artifacts/simpsons-demo/tadamevents-primary/` and `tadamevents-backup/`.
