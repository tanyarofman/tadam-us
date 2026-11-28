# 2026-11-26: Monthly Paddle income report by email

## Decided

- Tanya's Israeli business has received its income through Morning, which emails a monthly income summary she forwards to her accountant. Tadam's income comes through Paddle, which has no scheduled report emails, so the site now sends one (Tanya chose the automatic option over a calendar reminder).
- `netlify/functions/monthly-income-report.mjs` is a Netlify scheduled function that runs at 06:00 UTC on the 1st of each month and reports on the month before, using Israel-time month boundaries. The logic is in `netlify/lib/income-report.mjs`, with tests in `tests/income-report.test.mjs`.
- Content: completed transactions billed in the month, minus refunds and chargebacks approved in the month. Amounts are in the payout currency (customer paid, tax, Paddle fee, net), with a per-product breakdown because the Paddle account is shared with Velonova. Each email has a Hebrew summary and a CSV with one row per sale or refund.
- It runs on the 1st, not the last day of the month, so the last day's sales are included.
- If it fails, an alert goes to ORDER_EMAIL_TO.

## Open

- Tanya sets these in Netlify > tadam-us > Environment variables: `PADDLE_API_KEY` (a live key with read access to transactions and adjustments only) and `REPORT_EMAIL_TO` (her email and the accountant's).
- Check whether the accountant also needs Paddle's payout statement for the invoice to Paddle (see `docs/paddle/how-paddle-money-works.md`). This report summarizes sales; it is not the payout statement.
- The first real report goes out on 2026-12-01 for November. Use "Run now" on the function's log page to send one earlier.
