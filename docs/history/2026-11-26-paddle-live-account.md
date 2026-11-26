# Paddle live account: payouts and products (26 Nov 2026)

Plan step C from `docs/paddle/HANDOFF.md`. Tanya set up payouts herself; Claude checked the account and created the products in Tanya's browser at her request.

## Decision: one Paddle account for every product
Tanya has one legal entity, **Tanya Rofman** (sole trader), with the brand/display name **Velonova** (velonova.io, tanya@velonova.io). Tadam is one of several current and future digital products. Paddle works per legal entity: one account holds many products and several approved domains, with one payout and one invoice to Paddle per payout. So Tadam sells through the existing live account (seller ID 484499), not a separate signup.

## Done in the live account (vendors.paddle.com)
- Payouts: bank transfer to Tanya's Israeli bank account (entered by Tanya).
- Products, tax category "Standard digital goods", one-time USD prices, mirroring the sandbox:
  - "Tadam! Basic game" `pro_01m8by800afwep4hcd02fsmrj9`, price $99 `pri_01m8by9ch4gja0q23j26jx3yna`
  - "Tadam! VIP game" `pro_01m8by8fq6706f4r1p38de2rjw`, price $149 `pri_01m8byaf1safm15kd58hwaqwvq`
- Live price IDs added to `src/config/paddle.ts`; `environment` stays `sandbox`.

## Open
- **Legal name:** Account settings show legal name "Velonova" and website velonova.io, locked in the dashboard. Tanya emails sellers@paddle.com to set legal name Tanya Rofman, display name Velonova, and asks whether card statements can show the product name (buyers of Tadam! may not recognize "Velonova").
- **Verification** (Get started, step 04): needs Tanya's personal details and ID; she fills it in herself with legal name Tanya Rofman. A W-8BEN may be asked there.
- **Website approval:** no domains submitted in live yet. Submit tadamevents.com after the lawyer reviews the legal pages.
- **Live client-side token** (Developer Tools → Authentication), then switch `environment` to `production` after approval.
