# 2026-11-26: card statement line in the customer email

- Paddle invoices and card statements name the seller "Velonova" (the Paddle account name), not Tadam. Paddle has no per-product invoice branding; the account name covers all products, and "Invoice from" is always Paddle.com Market Ltd.
- Tanya chose to leave the Paddle invoice as it is. The Tadam confirmation email (`netlify/lib/notify.mjs`) now says the charge shows on the card statement as "PADDLE.NET* VELONOVA" (PR #79, merged), to prevent "I don't recognize this charge" disputes.
- The sandbox invoice showed "VELONOVA6"; the digit was left out because it may differ on live charges. Check a live statement and update the line if needed.

## Open
- Possible later: ask sellers@paddle.com whether the name on invoices and statements can be set per product, or whether Tadam can get its own seller account.
