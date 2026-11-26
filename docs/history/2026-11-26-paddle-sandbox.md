# Paddle sandbox set up (26 Nov 2026)

Plan step B.1 and B.2 from `docs/paddle/HANDOFF.md`, done by Claude in Tanya's browser at Tanya's request.

## Done in the sandbox (sandbox-vendors.paddle.com)
- Products, tax category "Standard digital goods", one-time USD prices:
  - "Tadam! Basic game" `pro_01m8bgj9fv6exae3vk09mq5wwg`, price $99 `pri_01m8bgmwct32162zqxk7q9s3bv`
  - "Tadam! VIP game" `pro_01m8bgjtq9ant473hng71veqmh`, price $149 `pri_01m8bgkrvfe70qyd87hvg93cf8`
- Client-side token "tadamevents.com checkout" (public by design, in `src/config/paddle.ts`).
- Website approval: tadamevents.com, checkout approved (Apple Pay domain file not added).
- Default payment link: https://tadamevents.com/create

## Why these prices
The site moved to two packages. Tanya confirmed on 2026-11-26: **Basic $99, VIP $149** (on the site since PR #61). The single "$99 per game" in the older `docs/paddle/` drafts was updated to match.

## Open
- The sandbox account is named "Velonova" and already had velonova.io approved: it's Tanya's other business. The default payment link is account-wide. For the live account, decide which legal name sells Tadam (the site says Tanya Rofman).
- Not done yet: an API key and the webhook destination (step B.4), the wizard at /create with Paddle.js (B.3), test purchases and a refund (B.5).
