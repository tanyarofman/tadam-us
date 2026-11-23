# Paddle readiness checklist for us.heytadam.com

Paddle approves the seller (business and identity) and every domain that opens a checkout. The domain review checks the website against Paddle's requirements and [Acceptable Use Policy](https://www.paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle). Sources: [domain approval](https://www.paddle.com/help/start/account-verification/what-is-domain-approval), [why domains are rejected](https://www.paddle.com/help/start/account-verification/why-has-my-domain-been-rejected), [account verification](https://www.paddle.com/help/start/account-verification/what-is-account-verification), [checkout domains](https://developer.paddle.com/partners/embed-billing/seller-go-live/checkout-domains).

## Website requirements

| # | Requirement | Where it's met | Status |
|---|---|---|---|
| 1 | Site is live on HTTPS (not "coming soon") | Netlify site on `us.heytadam.com` | To do (new repo) |
| 2 | Clear description of the product | `site-copy.md`: hero, How it works, What's included | Drafted |
| 3 | Prices visible without logging in | `site-copy.md`: Pricing ($99, euros converted by Paddle at checkout) | Drafted |
| 4 | Terms of Service, public, linked in the footer | `terms.md` at `/terms` | Drafted |
| 5 | Terms name Paddle as the merchant of record | `terms.md` section 3 | Drafted |
| 6 | Legal business name in the terms and footer, **exactly** as on the Paddle account | `terms.md` section 1, `site-copy.md` footer | Filled: Tanya Rofman |
| 7 | Privacy policy, public, linked in the footer | `privacy-policy.md` at `/privacy` | Drafted |
| 8 | Refund policy, public, linked, 14+ days, no "all sales final" or exclusions | `refund-policy.md` at `/refunds` | Drafted |
| 9 | Support contact on the site | Footer + legal pages: tanya@velonova.io for now | Swap for the new-domain address when the forward exists |
| 10 | The product fits Paddle (software, not a standalone human service) | Self-serve wording everywhere; no "we build it for you" | Drafted |
| 11 | No impersonation of real people (deepfakes, voice cloning) | Ready-made / invented hosts only, terms section 6 | Drafted |
| 12 | The wizard and checkout pages use the same story (self-serve, 30 days, $99) | English wizard (Tanya) | To do |
| 13 | Checkout domain submitted in Paddle: Checkout > Website approval | `us.heytadam.com` | After the site is live |

## Account requirements

| # | Requirement | Status |
|---|---|---|
| 1 | Business details of Tanya's עוסק מורשה (name, number, address) | Tanya has them |
| 2 | Identity verification (ID or passport) | At signup |
| 3 | Payout details (USD account at an Israeli bank, or Payoneer receiving details) | Tanya to choose |
| 4 | Application text (`paddle-application.md`) | Drafted |

## Order of work

1. Business details, support email, price and delivery time are filled (2026-11-23). Still open: the AI vendor list from Ilan for the privacy policy, and the new support address on the new domain.
2. Lawyer review of `terms.md` and `privacy-policy.md`.
3. Build and publish us.heytadam.com with the landing page and the three legal pages.
4. Open a Paddle **sandbox** account and wire the checkout and webhook (no approval needed).
5. Open the **live** account, complete verification, submit `us.heytadam.com` for domain approval.
6. One real purchase and one refund in live, then launch.
