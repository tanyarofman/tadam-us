# Homepage spacing and color refinements, November 25, 2026

Requested by Ilan as a further review of PR #54:

- Reduce the demo-card title-to-Play-demo gap from 24px to 12px.
- Make pricing cards, their typography, badges and buttons slightly smaller. Cards
  are about 13% shorter at the reviewed desktop viewport; keep controls at least
  44px tall and add more section padding below them.
- Basic body text/checkmarks: #C7D5EF; price: #05DBFB. VIP body text/checkmarks:
  #FFF9C5; price: #FBCE02. Badge/button labels retain dark text on colored backgrounds.
- Increase checkmark-to-text spacing from 30px to 36px.
- Reduce testimonial card top padding from 30px to 22px.
- Edit Emily's generated portrait to an upright pose with wider framing, preserving
  her identity, clothing and setting. Sophie and Marcus are unchanged. The new
  `emily-upright.webp` URL avoids showing a cached version of the previous pose.
  The edit prompt and asset path are in `docs/media/homepage-persona-portraits.md`.

Validation: 16 existing browser checks pass on desktop Chromium/Firefox and mobile
Chromium/WebKit. Astro check has no errors or warnings (one existing hint); the
production build creates 46 pages. Visually inspected desktop/mobile pricing, demo
card spacing and all three portraits, and confirmed the exact four computed colors.
