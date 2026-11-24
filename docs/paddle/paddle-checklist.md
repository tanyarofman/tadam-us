# Paddle readiness checklist for tadamevents.com

Paddle approves the seller (business and identity) and every domain that opens a checkout. The domain review checks the website against Paddle's requirements and [Acceptable Use Policy](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle). Sources: [domain approval](https://www.paddle.com/help/start/account-verification/what-is-domain-approval), [why domains are rejected](https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected), [account verification](https://www.paddle.com/help/start/account-verification/what-is-account-verification), [checkout domains](https://developer.paddle.com/partners/embed-billing/seller-go-live/checkout-domains).

## Review status (checked on the live site, 2026-11-24)

**Not submitted to Paddle yet.** There is no record of a sandbox or live Paddle account or of a domain submission in this repository. The site content is ready for the website review (rows 1 to 11 below), but two things block it:

1. **No checkout on the site yet.** Every "Create yours" button goes to `/create`, which is a "Coming soon" page with an email signup. The wizard and the Paddle checkout come later (row 12).
2. **The legal pages have no lawyer review yet** (`terms.md`, `privacy-policy.md`). Planned before the live account (HANDOFF.md, step C).

Changed today: no country or address on the site (Tanya's decision, see `docs/history/2026-11-24-remove-israel.md`). The legal name still matches the account, so row 6 still passes.

## Website requirements

| # | Requirement | Where it's met | Status |
|---|---|---|---|
| 1 | Site is live on HTTPS (not "coming soon") | Netlify project `tadam-us` on `tadamevents.com`, HTTPS on | **Done.** The home page is the self-serve site (PR #13). Only `/create` says "Coming soon" (see row 12) |
| 2 | Clear description of the product | Home page: hero, How it works, What's included | **Done** (PR #13) |
| 3 | Prices visible without logging in | Home page: "$99 per game, one-time, with no subscription" | **Done** (PR #13) |
| 4 | Terms of Service, public, linked in the footer | `/terms` | **Done** (PR #12), lawyer review still to do |
| 5 | Terms name Paddle as the merchant of record | `/terms` section 3 | **Done** (PR #12) |
| 6 | Legal business name in the terms and footer, **exactly** as on the Paddle account | `/terms`, `/privacy`, footer: "© 2026 Tanya Rofman. Payments processed by Paddle.com." | **Done** (PR #12, footer without country since PR #24) |
| 7 | Privacy policy, public, linked in the footer | `/privacy` | **Done** (PR #12), lawyer review still to do |
| 8 | Refund policy, public, linked, 14+ days, no "all sales final" or exclusions | `/refunds`: 14 days, no "all sales final" | **Done** (PR #12) |
| 9 | Support contact on the site | Footer + legal pages: hey@tadamevents.com (forward is live) | **Done.** No Messenger or Facebook link left on the home page |
| 10 | The product fits Paddle (software, not a standalone human service) | Self-serve wording on the home page and in the blog; no "we build it for you" | **Done** (PRs #13, #17, #21) |
| 11 | No impersonation of real people (deepfakes, voice cloning) | Ready-made / invented hosts only, `/terms` section 6 | **Done** (PR #12) |
| 12 | The wizard and checkout pages use the same story (self-serve, 30 days, $99) | English wizard (Tanya), at `/create` | **To do.** `/create` is a "Coming soon" page for now |
| 13 | Checkout domain submitted in Paddle: Checkout > Website approval | `tadamevents.com` | **To do,** after rows 12 and the live account |

## Account requirements

| # | Requirement | Status |
|---|---|---|
| 1 | Business details of Tanya's עוסק מורשה (name, number, address) | Tanya has them. They go only in the private Paddle forms, never on the site |
| 2 | Identity verification (ID or passport) | At signup. No account opened yet (no record here) |
| 3 | Payout details (USD account at an Israeli bank, or Payoneer receiving details) | Tanya to choose |
| 4 | Application text (`paddle-application.md`) | Drafted |

## Order of work

1. Business details, support email, price and delivery time are filled (2026-11-23). AI vendors are listed (`ai-vendors.md`); Ilan's opt-outs are still open. Domain, repo and support forward: `domain-setup.md`.
2. Lawyer review of `terms.md` and `privacy-policy.md`.
3. ~~Build and publish tadamevents.com with the landing page and the three legal pages.~~ Done 2026-11-24 (PRs #12, #13). The wizard and checkout at `/create` are still to come.
4. Open a Paddle **sandbox** account and wire the checkout and webhook (no approval needed).
5. Open the **live** account, complete verification, submit `tadamevents.com` for domain approval.
6. One real purchase and one refund in live, then launch.
