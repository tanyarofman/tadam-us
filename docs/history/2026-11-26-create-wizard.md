# 2026-11-26: the game creator (wizard) at /create

## What was decided (Tanya)
- The English order wizard from the tadam-il draft (branch `claude/stoic-albattani-id4pku`, PR 59 there, `docs/order-flow-handoff.md`) is taken into this site. The draft stays unmerged in tadam-il; never merge or close it.
- **Orders:** a Netlify function stores each order and its photos (Netlify Blobs), the Paddle checkout opens with the order id, and Paddle's webhook marks the order paid. No matching by email by hand.
- **Packages:** same screens as the draft; Basic or VIP is chosen on the order card. Prices and limits come from `PACKAGES` in `src/config/pricing.ts`.
- **Address:** `/create` (replaces the Coming soon page); thank-you page `/create/thanks/`.

## What was built (branch `feat/create-wizard`)
- Screens and styles: `src/components/create/Flow.astro`, `Thanks.astro`. Logic: `src/scripts/create.ts`.
- Lists Tanya will change: `EVENTS`, `HOSTS`, `SHAPES` and `CREATE.more.extra` in `src/content/create.ts`. Host photos: `public/create/hosts/`.
- `POST /api/order` (`netlify/functions/order.mjs`): validates and stores the order in Blobs store `orders` (production) or `orders-test` (previews, local).
- `POST /api/paddle-webhook` (`netlify/functions/paddle-webhook.mjs`): checks Paddle's signature, marks the order paid, and submits it with photos to the Netlify form `order`, so the team gets one email per **paid** order.
- Paddle keys come from Netlify environment variables (`src/config/checkout.ts`). Without them the wizard saves the order and shows a placeholder screen instead of the checkout.
- Changes from the draft: English only; no Hebrew labels in the order summary (it is in English); placeholder host names (Ethan, Goldie, Nora, Lily, Ray) instead of the Hebrew game's names; the Menachem host left out; the henna party replaced by "Bridal or baby shower"; Israeli examples in the question hints replaced; analytics events renamed `create_*`.

## Checked (local Netlify dev server, 1470x800 and 390x844)
- Whole flow to the thank-you page; no sideways scroll; switching Free story / Four options does not move the screen; a photo is attached, shrunk in the browser and stored with the order; a past date is refused; fewer than 3 answers is refused; an empty email/consent is refused.
- A signed fake Paddle webhook marked the order paid (VIP, 149.00 USD); a forged signature got 401; a repeat got "already paid"; another email cannot overwrite an order (409).
- Not checked: a real Paddle sandbox payment and the Netlify form email (both need the deploy preview and the Paddle keys).

## Paddle sandbox and security (later the same day)
- The sandbox ids from the Paddle setup session (PR #63: token `test_...`, Basic and VIP price ids) are the defaults on deploy previews and local runs (`src/config/checkout.ts`). Production uses only Netlify environment variables, so tadamevents.com never takes sandbox payments.
- Security review fixes: an order can be sent again only by the browser that made it (a random secret, stored hashed); the paid package comes only from a recognized Paddle price id (anything else is saved as `needs-review`); an order is never changed once Paddle reported a payment.
- The Netlify form `order` is public, so a fake "paid" email is possible: **before building a game, check the transaction id in the email against Paddle > Transactions.**

## Webhook set up and tested on the preview (later the same day)
- Paddle sandbox > Notifications: destination "Tadam! /create wizard (deploy preview 64)" for `https://deploy-preview-64--tadam-us.netlify.app/api/paddle-webhook`, events `transaction.completed` and `transaction.paid`. Its secret is in Netlify as `PADDLE_WEBHOOK_SECRET`, scope Deploy previews only.
- A signed test notification for order TD-XCG7CGY4E (VIP) was accepted: the order became paid (149.00 USD) and was submitted to the Netlify form `order`.
- **Problem: Netlify's spam filter put that submission in Spam**, so no email went out. Submissions sent from a server are likely to be flagged every time. Two `launch-list` signups (25 and 26 Nov) are in Spam as well. The email channel for paid orders needs a decision (see Open).
- The checkout footer says data is shared with "Velonova": in Paddle sandbox > Settings > Account settings the company legal name is Velonova (website velonova.io) and Paddle locks it ("Email sellers@paddle.com to request a change").
- Not done by Claude: a payment with Paddle's test card on the preview (left to Tanya).

## Paid-order email through Resend (later the same day)
- Tanya chose **Resend** (free email-sending service) over the browser sending the Netlify form.
- `netlify/lib/notify.mjs` emails each paid order to the team: summary fields, the full brief, photos attached, the customer's email as reply-to, and an Idempotency-Key per order so Paddle's retries send one email. Orders whose payment didn't match a package get "[CHECK]" in the subject.
- `paddle-webhook.mjs` uses it when `RESEND_API_KEY` is set; without the key it falls back to the Netlify form "order" (spam-prone). If Resend fails, the webhook answers 502, the order stays unpaid and Paddle retries.
- Tested locally against a stand-in Resend server: one email with the photo for a paid VIP order, the retry ignored, and Resend unreachable gave 502 with the order still awaiting payment.
- Netlify environment variables: `RESEND_API_KEY` (needed), `ORDER_EMAIL_TO` (default hey@tadamevents.com), `ORDER_EMAIL_FROM` (default `Tadam! orders <orders@tadamevents.com>`, needs tadamevents.com verified in Resend > Domains; until then `onboarding@resend.dev`, which only delivers to the Resend account's own email).
- Tanya created the Resend account and added tadamevents.com (region North Virginia, us-east-1; receiving off, so the Forward Email MX records stay in charge of hey@). Claude added Resend's 4 records to the Netlify DNS zone: TXT `resend._domainkey` (DKIM), CNAME `send` and `rsend` (to `*.forge.rmta.net`), TXT `_dmarc` `v=DMARC1; p=none;`. Resend was verifying when the session record was written.
- Tanya put the API key in Netlify as `RESEND_API_KEY` (secret, Functions, Production and Deploy Previews); Resend verified the domain.
- **End-to-end test passed:** Tanya paid on the preview with Paddle's test card (Basic, $99). Order TD-XJD2JTIO9 became paid with transaction txn_01m8bxnv8k555vzke58ey2catb, and Resend shows "New order TD-XJD2JTIO9: basic 99.00 USD" delivered to hey@tadamevents.com.
- The Paddle checkout let the buyer change the quantity. The sandbox Basic and VIP prices are now limited to quantity 1 (min 1, max 1), and the webhook sends any quantity other than 1 to "needs-review". **Do the same on the live prices.**

## Customer confirmation email and cleanup (later the same day)
- Each paid order now also sends the customer a confirmation through Resend ("Your Tadam! game is on its way (order TD-...)"), from `Tadam! <hey@tadamevents.com>`, replies to hey@. Copy matches the thanks page: order number, package, event date, the two next steps, Paddle sends the receipt; no prices, no delivery time. Best effort: a failure is logged and the order stays paid. Optional env var `CUSTOMER_EMAIL_FROM`.
- Tested locally against the stand-in Resend server: team email (with photo) and customer email both sent once; Paddle's retry sent nothing.
- Deleted the 3 test submissions in Netlify Forms at Tanya's request (her 2 launch-list signups and Claude's test order). Both forms are empty.
- The team's order email landed in Gmail spam (new domain). Tanya and Ilan: "Not spam" plus a Gmail filter for orders@tadamevents.com. The customer email may also land in spam at first.

## Open
- **Live Paddle prices:** set quantity min 1 and max 1 when creating them.
- Tanya: a test payment with Paddle's test card on the deploy preview.
- Tanya: email sellers@paddle.com to change the company name (Velonova) before the live review, or open the live account under the right name.
- Tanya: final events, host names and descriptions, questions. English-speaking hosts are still to be made (the photos are the Hebrew game's hosts).
- On the phone, the order card scrolls about 200 px (the consent tick is below the fold).
- After merge: the Coming soon signups (Netlify Forms > launch-list) should be emailed that the creator is open.
- Paddle live: only once Paddle approves the site; then set the production variables.

## Later on 2026-11-26: questions per event, no date/guests screen, simpler thanks page (Tanya)

- **The "When is the event? / How many guests?" screen is removed.** Step 4 is now only "Who hosts the game?". The order form still has `event-date` and `guests` fields; they are always empty now.
- **Each event has its own questions:** 9 per event plus the closing "anything else?" (about 10 screens), in `src/content/create.ts` (BIRTHDAY, MILESTONE, MITZVAH, FAREWELL, BACHELOR, SHOWER, WEDDING, ANNIVERSARY, FAMILY, REUNION, TEAM, COMPANY). Written from what Tanya learned on a real intake call: the buyer could not remember some answers (a show's name, a funny story) and did not want to name friends. So: easy facts first and stories later, one plain question per screen with a short hint, first names only, and a line on the first question saying short answers are fine and they can skip and come back (the draft saves in the browser). The call itself was only a reference; no question was taken from it.
- The group and office "how many people?" field on the name screen became "The occasion (optional)".
- **Thanks page:** one centered card (Option A of three mockups): headline, a Paid / We build / You review tracker, one sentence, one button, and a footer row with the order number, email and a link to the blog.
