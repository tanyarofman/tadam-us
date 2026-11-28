// Scheduled function: on the 1st of every month, emails last month's Paddle income report (Israel time) to
// REPORT_EMAIL_TO, with a CSV of every sale and refund. The work and the environment variables are in
// netlify/lib/income-report.mjs.
//
// Netlify runs scheduled functions only on the published production deploy. To send a report now (for example to
// check it), open Netlify > tadam-us > Logs > Functions > monthly-income-report and use "Run now"; a second run for
// the same month within 24 hours is not sent again (Resend idempotency key).
// Logs: the same page.
import { previousMonth, sendIncomeReport } from "../lib/income-report.mjs";

export default async () => {
  const month = previousMonth();
  let result;
  try {
    result = await sendIncomeReport(month);
  } catch (err) {
    result = { ok: false, status: 0, error: String(err?.message || err) };
  }
  if (result.ok) {
    const t = Object.entries(result.report.totals).map(([c, v]) => `${v.sales} sales, net ${v.net} ${c}`).join("; ") || "no sales";
    console.log(`Income report ${month.key}: sent (${t})`);
    return new Response("ok");
  }
  console.error(`Income report ${month.key}: failed: ${result.error}`);
  await alertFailure(month, result.error);
  return new Response("failed", { status: 500 });
};

/** Tells the team the report did not go out, so a missing report is noticed. */
async function alertFailure(month, error) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = (process.env.ORDER_EMAIL_TO || "hey@tadamevents.com").split(",").map((s) => s.trim()).filter(Boolean);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.REPORT_EMAIL_FROM || "Tadam! reports <orders@tadamevents.com>",
        to,
        subject: `[CHECK] Paddle income report for ${month.key} was not sent`,
        text: `The monthly Paddle income report for ${month.key} failed:\n\n${error}\n\nLogs: Netlify > tadam-us > Logs > Functions > monthly-income-report. Fix the cause and use "Run now" there.`,
      }),
    });
  } catch {
    // Logged above; nothing else to do.
  }
}

// 06:00 UTC on the 1st = 8:00 (winter) or 9:00 (summer) in Israel, when last month is complete.
export const config = { schedule: "0 6 1 * *" };
