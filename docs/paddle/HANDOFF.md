# Handoff: taking payments on tadamevents.com with Paddle

> **Copied on 2026-11-24** from `tanyarofman/tadam-il`, branch `claude/determined-galileo-aj62do`, folder `docs/us-eu/` (tadam-il PR #73). This folder in tadam-us is now the working copy: update it here, not in tadam-il.

Written 2026-11-24 for the next session. **Work happens in `tanyarofman/tadam-us`** (tadamevents.com). These drafts live in `tanyarofman/tadam-il`, branch `claude/determined-galileo-aj62do`, folder `docs/paddle/` (PR tadam-il#73, not merged). The first job of the next session is to copy them into tadam-us.

## 1. Decisions already made (don't reopen)

| Topic | Decision |
|---|---|
| Payment provider | **Paddle** (merchant of record: charges in USD/EUR, handles EU VAT and US sales tax, refunds, chargebacks). Stripe isn't available to Israeli businesses; Morning only charges in ILS |
| Seller | Tanya Rofman, עוסק מורשה (Israeli VAT-registered sole trader), business number 312896764, Ein Gedi 2/2, Tel Aviv 6203602, Israel. The number goes only in Paddle forms, never on public pages |
| Site | `https://tadamevents.com` (repo `tadam-us`, Netlify `tadam-us`). heytadam.com stays the Israeli site |
| Buying flow | **Self-serve**: "Create yours", English wizard (Tanya ports it from the Hebrew wizard), Paddle checkout on tadamevents.com, the game arrives by email as a private link |
| Price | **$99 per game**, one-time. Other currencies: Paddle's automatic conversion |
| Delivery | Within **24 hours** of payment |
| Refunds | Full refund within **14 days** of purchase, no questions, no exclusions |
| Retention | Game content and the game link kept **30 days**, then deleted |
| Hosts | Ready-made or invented characters only. **No host based on a real person** (Paddle restricts deepfakes and voice impersonation) |
| Support email | hey@tadamevents.com (live) |
| AI services | Base44, ElevenLabs, HeyGen, Seedance (BytePlus); Codex is probably dev-only (Ilan to confirm) |
| Backend | Base44 for now; Supabase is an acceptable fallback if Base44 can't do webhooks or a custom domain |

## 2. What's in `docs/paddle/` (copy all of it to tadam-us, e.g. `docs/paddle/`)

| File | Use |
|---|---|
| `paddle-checklist.md` | Paddle's website and account requirements, with status. **Main checklist** |
| `site-copy.md` | Self-serve landing copy (hero, how it works, $99 pricing, FAQ, footer) |
| `terms.md`, `refund-policy.md`, `privacy-policy.md` | Legal drafts: Paddle named as merchant of record, GDPR/UK GDPR/CCPA/COPPA. **Need a lawyer's review before launch** |
| `paddle-application.md` | Text for the Paddle signup forms |
| `paddle-signup-guide.md` | Step by step: sandbox now, live account later, payouts, tax form |
| `how-paddle-money-works.md` | Payouts, refunds (deducted from the Paddle balance), chargebacks, one Morning invoice to Paddle per payout |
| `ai-vendors.md` | What each AI service does with data, and Ilan's to-do list |
| `risks.md` | Open risks and the preliminary trademark check |
| `domain-setup.md` | Domain, Netlify and email status |

## 3. Gap review of tadamevents.com (tadam-us `main` @ 5a8824a, read from the code)

The site is still the copy of the Israeli done-for-you story. Paddle's domain review would likely fail on these:

| # | In tadam-us today | Fix |
|---|---|---|
| 1 | No prices: `PRICING.showPrices = false`, `currency: "₪"`, base 750 (`src/config/pricing.ts`) | $99 USD, show prices, drop the add-ons that don't exist for the US |
| 2 | Done-for-you steps: "Talk to us.", "We build the game.", "We build, you enjoy... After a short chat" (`src/content/copy.en.ts` ~88, 96, 152) and FAQ "Send us a message on Messenger" (~247) | Self-serve copy from `site-copy.md` |
| 3 | Real-person host: "create an event host based on your favorite aunt, the CEO..." (`copy.en.ts` ~199) | Remove |
| 4 | "The game is yours to keep... again and again" (`copy.en.ts` ~153) | "Your game link works for 30 days" |
| 5 | Contact = Messenger on the Israeli Facebook page (`src/config/site.ts`, `copy.en.ts` ~237, 274, 326), lead form | hey@tadamevents.com; the wizard replaces the lead form |
| 6 | "Create a game" goes to `https://tadam.base44.app/create` (`CREATE_URL`) where payment is a simulation | The English wizard + Paddle checkout on tadamevents.com |
| 7 | Privacy page is the Israeli one and still says "we do not use them to train AI models" (`src/pages/privacy.astro` ~64) | Replace with `privacy-policy.md` (it doesn't make that promise) |
| 8 | No `/terms`, no `/refunds` | Add from the drafts, link in the footer |
| 9 | Footer shows "© Tadam!" only | "© 2026 Tanya Rofman, Israel. Payments processed by Paddle.com" + legal links + email |

(The Israeli site heytadam.com already got the softened AI wording, tadam-il PR #76, merged.)

## 4. The plan, in order

**A. Site ready for Paddle review (Claude, in tadam-us, one PR per step, merge only when Tanya says)**
1. Copy `docs/paddle/` into tadam-us; add a `docs/history/` record.
2. Legal pages `/terms`, `/privacy` (replace), `/refunds` from the drafts; footer links, legal name, email, "Payments processed by Paddle.com".
3. Copy changes 2 to 5 in the table above; pricing section at $99 (`src/config/pricing.ts`, `src/components/Pricing.astro`).
4. "Create yours" points to the wizard route (placeholder page until the wizard exists, or the wizard itself).

**B. Paddle sandbox (Tanya + Claude)**
1. Tanya opens a sandbox account (sandbox-vendors.paddle.com) and creates the product "Tadam! personal game", one-time $99.
2. Tanya creates a client-side token and a webhook destination; Claude tells her exactly where. Secret keys never go in chat or code: use Netlify environment variables (or a network secret).
3. Claude adds Paddle.js overlay checkout (`Paddle.Initialize({ token })`, `Paddle.Checkout.open({ items: [{ priceId }], customer: { email }, customData: { gameId } })`) at the end of the wizard.
4. Webhook endpoint (Netlify Function, or Supabase): verify the `Paddle-Signature`, handle `transaction.completed` (mark the game paid, hand it to production in Base44) and refund/adjustment events (disable the game link).
5. Test with Paddle test cards, including a refund.

**C. Live account (when A is live and the lawyer has reviewed the legal pages)**
1. Sign up at paddle.com (Paddle Billing), business details above, ID verification.
2. Domain approval: Checkout → Website approval → `tadamevents.com`.
3. Payouts: USD account at Tanya's Israeli bank, or Payoneer USD receiving details if Paddle accepts them. Tax form if asked (W-8BEN).
4. Switch the site to live keys, one real purchase + refund, launch.

**D. Accounting:** one Morning invoice to Paddle per payout, export of services (0% VAT). Confirm with the accountant before the first payout.

## 5. Open items and risks

- **Ilan:** opt out of AI training at HeyGen (support) and Base44 (setting or plan), ask ElevenLabs about training and retention, confirm what data each service gets, sign DPAs, make sure 30-day deletion also deletes files at the vendors. Details: `ai-vendors.md`.
- **Wizard:** the English wizard must match the site (self-serve, $99, 24 h, 30 days, invented hosts only). It needs a real "after payment" screen.
- **Paddle may treat it as a human service** (the team reviews the game before delivery): keep self-serve wording and the honest 24-hour promise.
- **Generative AI scrutiny:** describe it as a party game, stock voices and hosts, no real-person likeness (`paddle-application.md`).
- **Children's data:** buyers 18+, consent clause, 30-day deletion; lawyer review.
- **Refund after the party** within 14 days: accepted cost; watch the rate.
- **Trademark:** no "TADAM" mark found by web search, but **TADADAA** (US, Class 9 game apps, Finnish owner) is close. Tanya should search USPTO and EUIPO herself or ask a lawyer. The official registries are blocked from the cloud sandbox.
- **Geo-redirect on heytadam.com** sends US/EU visitors to heytadam.com/en (the Israeli English site, `netlify/edge-functions/locale.js` in tadam-il). Consider sending them to tadamevents.com instead.
- **Ask Paddle:** whether it keeps its fee on refunded sales, and how a negative balance is handled.
- Search Console and Bing for tadamevents.com.

## 6. Sources used

Paddle: [domain approval](https://www.paddle.com/help/start/account-verification/what-is-domain-approval), [rejections](https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected), [account verification](https://www.paddle.com/help/start/account-verification/what-is-account-verification), [checkout domains](https://developer.paddle.com/partners/embed-billing/seller-go-live/checkout-domains), [AUP](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle), [refunds](https://www.paddle.com/help/manage/your-customers/how-do-i-issue-refunds), [chargebacks](https://www.paddle.com/help/manage/risk-prevention/understanding-chargebacks-with-paddle), [supported countries](https://developer.paddle.com/concepts/sell/supported-countries-locales). AI vendors: see `ai-vendors.md`.
