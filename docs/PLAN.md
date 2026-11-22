# Landing page update plan (2026-11-16)

Briefing for every session working on this update. Read this first, then `CLAUDE.md`.
Hard rules from the brief still apply: Hebrew only, RTL, parents addressed in plural (אתם), no em-dashes,
no real celebrities / athletes / recognizable characters, ask before a paid service, before changing story order,
before using an image of a real person. Never commit to `main`; branch + PR; merge only when Tanya asks.

## What Tanya asked for

1. All copy speaks about an **event** (birthday, bar/bat mitzvah, wedding, ...), not only a bat mitzvah.
2. Every "רוצים לשחק עכשיו?" button becomes a **demo** button (this is a recording of a real game, not a live game to play). Needs good copy.
3. Remove the text "מי המנחה? הילד.ה בוחר.ת את המנחה."
4. Scene 3 (host + running questions/answers): replace with the **demo video**. The "favorite singer" host slot is replaced by the demo.
5. Walk through Ilan's full onboarding flow, judge whether it is a headache for people, and **define the full flow**.
6. **Pricing** is missing from the page.
7. Design: look like the game itself. Same electric blue, same stage elements, one to one.
8. Replace all illustrations with **photorealistic people** (generated, fictional) who feel like real people playing.
9. Review Ilan's landing page (copy + design) and decide what to take.
10. **Add-ons**: e.g. a link where the kids/friends add content too (+X), pick one of 5 hosts or create a personal host (+100 to 300 ILS).
11. Use the **same fonts as the game**.
12. The "מה נועה לא מסוגלת לאכול" part must match the real game screen, desktop and mobile.

## Facts gathered (do not re-derive)

**Game font**: `Almoni Tzar ML v5 AAA` (Regular + Bold, OTF), taken from `https://tadam.base44.app/fonts/`.
Already in `public/fonts/` and wired in `src/styles/tokens.css` (`--font-display` / `--font-body` = "Almoni").
It is much narrower than Fredoka/Rubik, so body sizes need to go up a notch. It is a commercial AAA Type font,
so Ilan/Tanya must confirm the license covers this domain.

**Game look** (from the recording and screenshots): saturated electric blue stage with vertical light beams,
dark-navy edges, a glowing white/cyan floor strip with reflections, generic suited host in the middle.
Question text is **yellow**, heavy and condensed, right-aligned; "שאלה ראשונה" label in white above it.
Answers are **white pills**: answer text on the right, a gray vote count on the left; the correct answer fills with **green**
(the wrong chosen one fills pink) as a result bar; on the phone the picked answer is **yellow**. Round circular countdown
(white ring) on the left. Logo top-left. Bottom-left: "N מחוברים" + white QR card. Final screen: podium (1, 2, 3) with crown,
confetti, and a line of text under it. The phone view is the same blue with the logo on top and the same white pills.
It is **not** the 4 colored Kahoot-style buttons the page shows today.

**Demo video**: `public/demo/tadam-demo.mp4` (93 s, 1252x720, 4 MB, desktop big screen on the left + phone on the right) and
`public/demo/tadam-demo-poster.webp`. Cut from Tanya's 4.5 min recording. I removed the parts that show a
cartoon movie character, kids' show cartoons and **private family photos** (the demo questions use them). Do not re-add them.
The phone status bar in the video shows a `base44.app` demo URL; fine for now, mention it to Tanya.

**Ilan's landing** (`https://tadam.base44.app/`): hero "שעשועון אישי לאירוע שלכם" with a TV + phone mockup, events strip
(ימי הולדת / בר ובת מצווה / חתונות / מסיבות רווקים-רווקות), 3 steps (מספרים על החוגגים / נותנים לזה אופי / כולם נכנסים למשחק)
under "אתם מביאים את הסיפורים. אנחנו את השואו.", a host section ("יש מנחה לכל חגיגה", realistic faces), a "famous hosts for special
events" block (we do NOT do this, it conflicts with our brief), **pricing**, 7 FAQ items, closing CTA "אז, למי עושים טדאם?".
Alternating dark-blue and cream bands, yellow pill CTAs, magenta swoosh under key words, small spark marks around headlines.
**Pricing (decided by Tanya, 2026-11-16; source of truth is `src/config/pricing.ts`):**
- משחק אישי לאירוע: **790 ILS** (set 2026-11-22) (your stories, one of 5 ready-made hosts, a game every guest plays)
- Every extra is **50 ILS**: an edit of an already produced game (via the game's edit link), the contributor link for friends and kids, a personal host.
- Ilan's page and the live checkout popup still show the old **250 / 50**; the app must be aligned to the numbers above (the payment screen is also still a simulation, see `docs/onboarding-flow.md`).

**Onboarding flow** (`/create`, wizard, mobile first): 1 פרטי האירוע (free text or voice recording about the celebrants, up to 5 photos,
number of questions with +/- stepper, recommended 9, "each extra question is about a minute") -> 2 בחירת מנחה -> 3 בחירת קול -> 4 יצירת המשחק.
A deeper audit is one of the sessions below.

## Sessions (one branch + draft PR each)

| # | Session | Branch | Owns (files) |
|---|---|---|---|
| A | Stage design 1:1 with the game | `feat/stage-design` | `tokens.css`, `global.css`, `StageBackdrop.astro`, scene backgrounds, type scale for Almoni |
| B | Event-neutral copy + demo CTA | `feat/event-copy-demo-cta` | `copy.he.ts` (everything except `scene5`, `pricing`, `scene3`), CTA labels in hero / scene7 / modal / footer |
| C | Scene 3 becomes the demo video | `feat/scene3-demo-video` | `Scene3Reveal.astro`, `scripts/scenes/scene3.ts`, `HostSlot.astro` (delete), `public/hosts/` (delete), `copy.he.ts` `scene3` block |
| D | Scene 5 = the real game screen | `feat/scene5-real-game-ui` | `Scene5Moment.astro`, `scripts/scenes/scene5.ts`, `copy.he.ts` `scene5` block |
| E | Pricing + add-ons | `feat/pricing-addons` | new `Pricing.astro`, `src/config/pricing.ts`, `copy.he.ts` `pricing` block, FAQ items about price |
| F | Photoreal people | `feat/real-people-imagery` | `Guest.astro`, `HallArt.astro`, `KidOnStage.astro`, new `public/people/` |
| G | Onboarding flow audit | `docs/onboarding-flow` | `docs/onboarding-flow.md` only (research, no site code) |

Foundation (fonts, demo video, this plan) is on `claude/clever-maxwell-u8474e`. Merge it first, the others branch from it.
Keep changes inside your files so PRs merge cleanly. If you must touch another session's file, keep it to a few lines.

## Open items for Tanya

- The price is 790 since 2026-11-22 (extras of 50 not re-confirmed, see `src/config/pricing.ts`); the `// TODO confirm` marks there are still to be cleared by Tanya. Ilan must update the checkout popup (it hard-codes 250 / 50) and add a real payment step.
- Almoni font license.
- Demo video: the phone bar shows a `base44.app` URL; and ideally a purpose-made demo (no cartoon / family media) is recorded later.
- Photoreal people use image-generation credits (Magnific). Confirm before the imagery session runs.
