# Mobile review — 18 November 2026

Local preview: `http://127.0.0.1:4321/`. Tested in Chrome with phone-sized viewports, including 390 × 844, 360 × 740, 320 × 568, and 844 × 390 landscape. These are browser layout checks, not physical iOS/Android tests.

## Changes from the mobile review

- Reduced the leaderboard's portrait photo, row spacing, and panel padding on short phones so all five ranks fit while the scene is pinned.
- Tightened the step section's vertical spacing on short phones.
- Added landscape layouts for the story video, step cards, and leaderboard. The video no longer collapses to a tiny frame; cards use their width, and the leaderboard title sits beside the rows.
- Kept footer icons visually small while giving footer links at least 44 px of tap height.

## Checks

- Hero videos wait for the logo intro, play muted together, and pause when offscreen. Four existing playback tests pass using `node --experimental-strip-types --test tests/synced-preview.test.mjs`.
- The demo shortcut reaches the video. Play/pause and mute controls work.
- The three step cards transition in order. The leaderboard animates and updates scores.
- No horizontal page overflow or broken images was found. Feature descriptions retain their requested two lines at 320 px width.
- Required name and valid email enable the form; empty/whitespace names and invalid email keep it disabled. Phone/event remain optional. Phone input is right-aligned. Test fields were cleared, and no message was submitted.
- FAQ answers expand and collapse using native details; the Eyal example link includes `?autostart=1`.
- The closing Messenger link is `https://m.me/heytadam?ref=bottom`.
- The 320 × 568 leaderboard ends at 540 px while pinned, leaving all five rows visible. The 844 × 390 landscape step card fits between 68 px and 322 px, including both chat messages.
- `npm run check`, `npm run build`, and `git diff --check` pass (one pre-existing inline-handler hint in `Person.astro`).

The preceding visual updates are included: animated opening text with the underline on "מחכים", the new dinner-table photograph, full host cards without the custom-persona block, two-line feature descriptions, and the closing CTA on the shared background. See [image asset and prompt](event-dinner-image.md).

Subsequent spacing updates center the complete host section, lower the portraits inside their cards, add the larger `(ואפשר גם ליצור מנחה משלכם!)` heading, and increase space above "מה זה כולל?". The closing section now has 88 px / 216 px top/bottom padding on desktop and 64 px / 176 px on mobile. The footer contact label is "דברו איתנו".

## Integration with the latest main branch

The subsequent merge of #50 retains its logo-only reveal, larger standalone leaderboard with a dimmed game-video background, softer score animations, and removal of the grandmother photo and crowd animation. The earlier photograph-specific leaderboard measurements above describe the initial mobile review. The combined version keeps the synchronized hero clips, final copy and spacing, large readable subtitles, and compact short-screen/landscape styles.

## Manual/device checks still needed

- Chrome denied native fullscreen with `TypeError: not granted` in the automated browser session. Fullscreen on a physical phone and iPhone's native video player remain unverified.
- Physical touch gestures, on-screen keyboard behavior, and iOS browser chrome are not reproduced by a viewport override.
- Netlify form delivery needs a deployed site; this review only checked local form validation.
