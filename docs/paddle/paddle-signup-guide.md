# Opening the Paddle accounts: step by step

Paddle has two separate accounts with separate logins:

| | Sandbox | Live |
|---|---|---|
| Address | sandbox-vendors.paddle.com | vendors.paddle.com (sign up at paddle.com) |
| What for | Testing: fake money, test cards | Real sales |
| Approval needed? | No, works right away | Yes: business, identity and website checks |
| When | **Now** | When tadamevents.com is live with prices and the three legal pages |

## 1. Sandbox (now, about 10 minutes)

1. Go to sandbox-vendors.paddle.com and sign up with your email.
2. Business name: **Tadam!** Country: **Israel**.
3. That's it. Paddle Billing (the current version) is the default; don't choose "Classic".
4. Later, Claude builds the checkout against this account. You'll be asked for a **client-side token** (Developer Tools → Authentication) and to create a **webhook** endpoint. Claude will tell you exactly which values to copy and where to paste them. Never paste secret keys into a chat.

## 2. Live account (when the site is live)

Have these ready:

- **Business:** Tanya Rofman, sole trader (עוסק מורשה), business number 312896764, Ein Gedi 2/2, Tel Aviv 6203602, Israel.
- **Website:** https://tadamevents.com, with prices, terms, privacy and refund pages visible.
- **Support email:** hey@tadamevents.com.
- **ID:** your Israeli ID or passport, for the identity check (usually a photo of the document and a selfie).
- **Answers for the forms:** copy them from `paddle-application.md`.

Steps:

1. Sign up at paddle.com and choose Paddle Billing.
2. Fill in the business details exactly as above. The name must match the terms and the site footer.
3. **Identity verification:** upload the ID.
4. **Domain approval:** Checkout → Website approval → add `tadamevents.com`. Paddle reviews the site, usually within a few business days, and may ask questions by email. Answer with the same wording as the site.
5. **Payouts:** Business account → Payouts.
   - Option A: a **USD account at your Israeli bank**. Ask the bank for the details for incoming USD wires (IBAN, SWIFT).
   - Option B: **Payoneer**. In Payoneer, check "Receive" → "Receiving accounts" for USD details, and ask Payoneer whether it accepts payments from Paddle.
6. **Tax details:** Paddle may ask for tax information, for example a W-8BEN form that confirms you're not a US taxpayer. Fill in what it asks, and check with your accountant if unsure.
7. Create the products in the live account, as in the sandbox: **"Tadam! Basic game", one-time $99 USD** and **"Tadam! VIP game", one-time $149 USD**. Paddle shows other currencies automatically.

## 3. After approval

1. Claude switches the site from sandbox to live.
2. Make one real purchase with your own card, then refund it from the Paddle dashboard to see the whole flow.
3. Launch.

## Good to know

- Paddle's fee: about 5% + $0.50 per sale. Check the current rate at signup.
- Refunds and chargebacks: see `how-paddle-money-works.md`.
- Invoices in Morning: one invoice to Paddle per payout. Confirm the details with your accountant.
