# Order flow (the wizard): handoff

Written 2026-11-23 for the session that builds the self-serve site for the US and Europe.
The wizard was built in this repo (`tanyarofman/tadam`) as a basis. It will move to the new site and be adapted there.

## Where it lives

- Branch `claude/stoic-albattani-id4pku`, draft PR [tanyarofman/tadam#59](https://github.com/tanyarofman/tadam/pull/59). **Not merged, not linked from the live site.**
- Preview: `https://deploy-preview-59--heytadam.netlify.app/en/start/` (English) and `/start/` (Hebrew).
- Add `?new` to either address to drop the saved draft and start from the first screen.

## What the customer goes through

One thing per screen, a thin progress line on top, and one fixed bottom bar where "Back" and the main button never move.

| # | Screen | Notes |
|---|---|---|
| 0 | Start | Headline, one line, the button, the price, and a clip of the game |
| 1 | What are you celebrating? | 12 event tiles; picking one moves on |
| 2 | Name | Name, one optional detail, and a live preview of the game title on a "big screen". The title is edited in place |
| 3 | Guided questions | One question per screen. Free story (typed or recorded) or four options with the correct one marked. A photo can be attached to any question. The last screen is always "Anything else you have not told us?" |
| 4 | When, then host | Date (not in the past) and rough guest count, both optional. Then the host picker |
| 5 | Order card | Game title, what is included, the price, one email field, one confirmation tick |
| 6 | Placeholder | Shown only when no payment link is set |
| – | Thank-you page | Where the payment page returns the customer |

Rules built in:

- At least 3 answered questions to leave step 3 (`MATERIAL.minPrompts`). Fewer shows a message with a link back to the first empty question.
- Up to 5 photos in total (`MATERIAL.maxPhotos`). Each photo is scaled down in the browser to 1600 px before sending, so file size does not matter. A file the browser cannot open is rejected with a message.
- The draft is saved in the browser (`localStorage`) on every change. Photos are not saved there: after a reload the customer is asked to choose them again.
- Each language keeps its own draft.

## What to change on the new site, and where

Everything that is expected to change is in two files. The logic does not need touching.

| To change | Where |
|---|---|
| Event names and icons | `EVENTS` in `src/content/intake.en.ts` |
| Host names and descriptions | `HOSTS` in the same file. Photos in `public/intake/hosts/` |
| The questions, their hints and examples | `SHAPES` in the same file: one list each for `person`, `couple` and `group`. An event can replace its shape's wording and questions with `override` (the office party does) |
| The closing "anything else?" question | `INTAKE.more.extra` in the same file |
| All other wording | `INTAKE` in the same file |
| Price and payment link | `ORDER_EN` in `src/config/pricing.ts` |
| How much text counts as one question, minimum answers, photo limit | `MATERIAL` in `src/content/intake.he.ts` (shared by both languages) |

Keep the event ids, host ids and question ids stable once orders start coming in: they travel with every order.

## Files to copy

| File | What it is |
|---|---|
| `src/components/intake/Flow.astro` | All the screens and all their styles (about 2,270 lines, most of it CSS) |
| `src/components/intake/Thanks.astro` | The thank-you page |
| `src/scripts/intake.ts` | The logic: navigation, saving, recording, photos, building and sending the order |
| `src/content/intake.en.ts` | English wording and config |
| `src/content/intake.he.ts` | Hebrew wording and config. The English file takes its types (`EventTile`, `Shape`, `ShapeConfig`) and the `fill` helper from here, and `MATERIAL` lives here |
| `src/config/pricing.ts` | Only the `ORDER_EN` block is needed for English |
| `public/intake/hosts/*.webp` | Host photos |
| `src/pages/en/start.astro`, `src/pages/en/start/thanks.astro` | Two-line pages that render the components with `lang="en"` |

If the new site is English only, the Hebrew file can be reduced to the types, `MATERIAL` and `fill`, and the `lang` switch in the two components can go.

## What the wizard takes from this site

The new site has to supply these, or the copies have to be adjusted:

- **Layout:** `src/layouts/Base.astro`. It sets the page language and direction from the address (`/en/…` is English, left-to-right).
- **Global styles:** `src/styles/global.css`. The wizard uses its classes `btn`, `btn-buzzer`, `btn-dot`, `display`, `h-card`, `h-scene`, `lead`, `skip-link`, and its variables `--game-yellow`, `--stage-navy`, `--text-muted`, `--font-display`, `--fs-small`, `--radius-s`, `--radius-m`, `--gutter`, `--ease-out`, `--pill-ink`, `--pill-white`, `--buzzer-red`, `--answer-correct`.
- **Font:** Almoni (`public/fonts/`). The start screen waits for it to load before showing.
- **Small helpers:** `track` from `src/lib/analytics.ts` (a stub, no vendor), `demoMedia` and `contactLink` from `src/config/site.ts`, `BLOG_COLLECTION` from `src/content/copy.ts` (the thank-you page suggests blog articles).
- **Assets:** the English logo `public/brand/tadam-logo-en.webp` and the English game clip `public/demo/hero-screen-en-v2.mp4` with its poster.

## Where an order goes

On "Continue to payment" the wizard posts one multipart request to `/` as the Netlify form `order`. Netlify registers the form from the hidden `<form name="order">` at the bottom of `Flow.astro`, so the field names there and in the script must stay in step.

| Field | Content |
|---|---|
| `order-id` | Made in the browser: `TD-` plus a short code from the time. One per draft |
| `lang` | `he` or `en` |
| `email` | The customer's email |
| `event`, `about`, `game-title`, `host` | Event label, name with the optional detail, game title, host name |
| `event-date`, `guests` | Optional |
| `price` | The price text shown to the customer |
| `brief` | The whole order as readable text. Its labels are in Hebrew on purpose: the team reads Hebrew |
| `brief-json` | The same as JSON |
| `photo-1` … `photo-5` | The attached photos, in question order. `brief-json.photos` says which question each belongs to |

After a successful post the browser goes to the payment link (`ORDER_EN.paymentUrl`). If it is empty, step 6 appears instead. The payment page should return the customer to `…/start/thanks/`.

## Not connected yet

- **Payment for English.** `ORDER_EN.paymentUrl` is empty. The price shown is $99.
- **Matching a payment to an order.** There is no automatic link. The order and the payment are matched by the email the customer types in both places. A payment tool with an API or a webhook would fix this, and would also allow passing the email to the payment page.
- **Notification of a new order.** Netlify emails only the `lead` form today. Orders wait in the Netlify dashboard under Forms → order until a notification is added.
- **Hosts in English.** The picker offers the seven hosts of the Hebrew game with translated descriptions. English-speaking hosts are still to be made.

## Decisions already made (so they are not reopened by accident)

- The customer pays at the end, after filling everything in, and before the game is built. No account, no card earlier.
- Up to 2 rounds of changes before the event. It is written on the order card and on the thank-you page.
- Only an email is asked in the wizard. Name and phone are collected by the payment page.
- A separate "your own question" screen and separate photo screens were tried and dropped: a photo attaches to any question, and the closing question takes a story or the customer's own four-option question.
- Sharing the draft with someone else ("someone knows them better") was removed.
- Hebrew price 390 ₪ (set 2026-11-23), English price $99 (set 2026-11-23).
- The event list was kept as is for English, including the henna party and the bar or bat mitzvah, because the English flow in this repo is for English speakers in Israel. The new site is expected to replace it.

## How it was checked

Both flows were run in a headless browser from the first screen to the thank-you page, at 1470×800 and 390×844, with the form post and the payment page intercepted. A real order to Netlify and a real payment were not tested.

On a phone a few screens scroll slightly: the event picker (about 1 to 4 px), the closing question in four-options mode (about 55 px) and the order card (about 20 px in Hebrew, 60 px in English).

## Background

- `docs/onboarding-flow.md`: the audit of the existing creation wizard on tadam.base44.app that started this work.
- `docs/intake-flow.md` and `docs/ilan-handoff.md`: the first specification and the Hebrew handoff to Ilan from 2026-11-16. Both describe an earlier version of the screens (review and launch screens that no longer exist), so read them for the reasoning, not for the current flow.
