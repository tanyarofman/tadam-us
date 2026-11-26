// Monthly Paddle income report for Tanya and her accountant, sent by netlify/functions/monthly-income-report.mjs
// on the 1st of every month for the month before (Israel time, like Morning's monthly summary).
//
// What it counts: every completed Paddle transaction billed in the month, minus refunds and chargebacks approved in
// the month. The Paddle account is shared by all of Tanya's products, so the report covers all of them and breaks
// the totals down by product. Amounts are in the payout currency (what Paddle pays Tanya), next to what each
// customer paid in their own currency.
//
// It is a summary of sales, not the payout statement: Paddle pays the balance out on its own schedule, and the
// accountant may still need Paddle's payout statement for the invoice (docs/paddle/how-paddle-money-works.md).
//
// Netlify environment variables (server-only, never in the repo):
//   PADDLE_API_KEY      Paddle > Developer tools > Authentication > API keys, with read permission for
//                       transactions and adjustments only. A sandbox key (pdl_sdbx_...) reads the sandbox account.
//   REPORT_EMAIL_TO     who gets the report, comma-separated (Tanya and the accountant).
//                       Default: ORDER_EMAIL_TO, else hey@tadamevents.com.
//   REPORT_EMAIL_FROM   default "Tadam! reports <orders@tadamevents.com>".
//   RESEND_API_KEY      the same key the order emails use.

export const TIME_ZONE = "Asia/Jerusalem";

const HE_MONTHS = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];

/** Milliseconds `tz` is ahead of UTC at the instant `ms`. */
function offsetAt(ms, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(new Date(ms))
      .map((p) => [p.type, p.value]),
  );
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return local - Math.floor(ms / 1000) * 1000;
}

/** The UTC instant of midnight on the 1st of `month` (1-12) in `tz`. */
function monthStart(year, month, tz) {
  const guess = Date.UTC(year, month - 1, 1);
  let t = guess - offsetAt(guess, tz);
  t = guess - offsetAt(t, tz); // second pass in case the offset changed around midnight
  return new Date(t);
}

/** The calendar month before `now` in `tz`: { key: "2026-11", label: "נובמבר 2026", start, end } (end exclusive). */
export function previousMonth(now = new Date(), tz = TIME_ZONE) {
  const local = new Date(now.getTime() + offsetAt(now.getTime(), tz));
  let year = local.getUTCFullYear();
  let month = local.getUTCMonth(); // 0-11 this month = 1-12 previous month
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  return monthFor(year, month, tz);
}

export function monthFor(year, month, tz = TIME_ZONE) {
  const next = month === 12 ? [year + 1, 1] : [year, month + 1];
  return {
    key: `${year}-${String(month).padStart(2, "0")}`,
    label: `${HE_MONTHS[month - 1]} ${year}`,
    start: monthStart(year, month, tz),
    end: monthStart(next[0], next[1], tz),
  };
}

export function apiBase(env = process.env) {
  if (env.PADDLE_API_URL) return env.PADDLE_API_URL.replace(/\/$/, "");
  return /^pdl_sdbx_/.test(env.PADDLE_API_KEY || "") ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
}

async function paddleGet(url, env) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${env.PADDLE_API_KEY}`, "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(`Paddle ${res.status} for ${new URL(url).pathname}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

/** Every completed transaction billed in [start, end). */
export async function fetchTransactions({ start, end }, env = process.env) {
  const q = new URLSearchParams({
    status: "completed",
    "billed_at[GTE]": start.toISOString(),
    "billed_at[LT]": end.toISOString(),
    order_by: "billed_at[ASC]",
    per_page: "100",
  });
  let url = `${apiBase(env)}/transactions?${q}`;
  const out = [];
  for (let page = 0; url && page < 100; page++) {
    const body = await paddleGet(url, env);
    out.push(...(body.data || []));
    url = body.meta?.pagination?.has_more ? body.meta.pagination.next : null;
  }
  return out;
}

/** Approved adjustments (refunds, chargebacks) created in [start, end). The API has no date filter, so this pages
 *  newest first and stops once it reaches the month before. */
export async function fetchAdjustments({ start, end }, env = process.env) {
  const q = new URLSearchParams({ status: "approved", order_by: "id[DESC]", per_page: "50" });
  let url = `${apiBase(env)}/adjustments?${q}`;
  const out = [];
  for (let page = 0; url && page < 100; page++) {
    const body = await paddleGet(url, env);
    let older = false;
    for (const a of body.data || []) {
      const at = new Date(a.created_at);
      if (at < start) older = true;
      else if (at < end) out.push(a);
    }
    url = !older && body.meta?.pagination?.has_more ? body.meta.pagination.next : null;
  }
  return out;
}

// Paddle amounts are strings in the currency's smallest unit (cents). JPY and KRW have none.
const ZERO_DECIMAL = new Set(["JPY", "KRW"]);
const toMajor = (v, cur) => (Number(v) || 0) / (ZERO_DECIMAL.has(cur) ? 1 : 100);
const money = (n, cur) => {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);
  } catch {
    return `${n.toFixed(2)} ${cur}`;
  }
};

const ADJUSTMENT_TYPE = { refund: "Refund", chargeback: "Chargeback", chargeback_warning: "Chargeback warning", chargeback_reverse: "Chargeback reversed", credit: "Credit", credit_reverse: "Credit reversed" };

function israelDate(iso) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: TIME_ZONE }); // YYYY-MM-DD
}

function productNames(tx) {
  const names = (tx.details?.line_items || []).map((li) => li.product?.name).filter(Boolean);
  if (names.length) return [...new Set(names)].join(" + ");
  const fallback = (tx.items || []).map((i) => i.price?.name || i.price?.description).filter(Boolean);
  return [...new Set(fallback)].join(" + ") || "Unknown product";
}

/**
 * One row per sale or adjustment, plus totals per payout currency and per product.
 * Each row: { date, type, id, transaction, invoice, product, customerCurrency, customerPaid,
 *             currency, total, tax, fee, net }. Adjustments carry negative amounts (positive when reversed).
 */
export function buildReport(transactions, adjustments, month) {
  const rows = [];
  const productOf = new Map();
  for (const tx of transactions) {
    const pt = tx.details?.payout_totals || tx.details?.totals || {};
    const t = tx.details?.totals || {};
    const cur = pt.currency_code || tx.currency_code;
    const product = productNames(tx);
    productOf.set(tx.id, product);
    rows.push({
      date: israelDate(tx.billed_at || tx.created_at),
      type: "Sale",
      id: tx.id,
      transaction: tx.id,
      invoice: tx.invoice_number || "",
      product,
      customerCurrency: tx.currency_code,
      customerPaid: toMajor(t.grand_total ?? t.total, tx.currency_code),
      currency: cur,
      total: toMajor(pt.total, cur),
      tax: toMajor(pt.tax, cur),
      fee: toMajor(pt.fee, cur),
      net: toMajor(pt.earnings, cur),
    });
  }
  for (const a of adjustments) {
    const pt = a.payout_totals || a.totals || {};
    const cur = pt.currency_code || a.currency_code;
    const sign = /_reverse$/.test(a.action) ? 1 : -1;
    const extraFee = toMajor(pt.chargeback_fee?.amount, cur); // Paddle's non-refundable chargeback fee
    rows.push({
      date: israelDate(a.created_at),
      type: ADJUSTMENT_TYPE[a.action] || a.action,
      id: a.id,
      transaction: a.transaction_id || "",
      invoice: "",
      product: productOf.get(a.transaction_id) || "",
      customerCurrency: a.currency_code,
      customerPaid: sign * toMajor(a.totals?.total, a.currency_code),
      currency: cur,
      total: sign * toMajor(pt.total, cur),
      tax: sign * toMajor(pt.tax, cur),
      fee: sign * toMajor(pt.fee, cur) + extraFee,
      net: sign * toMajor(pt.earnings, cur) - extraFee,
    });
  }
  rows.sort((x, y) => (x.date < y.date ? -1 : x.date > y.date ? 1 : 0));

  const totals = {};
  const byProduct = {};
  for (const r of rows) {
    const t = (totals[r.currency] ||= { sales: 0, adjustments: 0, total: 0, tax: 0, fee: 0, net: 0 });
    if (r.type === "Sale") t.sales += 1;
    else t.adjustments += 1;
    for (const k of ["total", "tax", "fee", "net"]) t[k] += r[k];
    const pKey = `${r.product || "Other"}|${r.currency}`;
    const p = (byProduct[pKey] ||= { product: r.product || "Other", currency: r.currency, sales: 0, net: 0 });
    if (r.type === "Sale") p.sales += 1;
    p.net += r.net;
  }
  for (const t of Object.values(totals)) for (const k of ["total", "tax", "fee", "net"]) t[k] = Math.round(t[k] * 100) / 100;
  return { month, rows, totals, byProduct: Object.values(byProduct) };
}

const csvCell = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s) && !/^-?\d/.test(s)) s = `'${s}`; // no spreadsheet formulas from data
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const num = (n) => (Math.round(n * 100) / 100).toFixed(2);

export function reportCsv(report) {
  const head = ["Date (Israel)", "Type", "Paddle ID", "Transaction", "Invoice number", "Product", "Customer currency", "Customer paid", "Currency", "Total incl. tax", "Tax", "Paddle fee", "Net to you"];
  const lines = [head, ...report.rows.map((r) => [r.date, r.type, r.id, r.transaction, r.invoice, r.product, r.customerCurrency, num(r.customerPaid), r.currency, num(r.total), num(r.tax), num(r.fee), num(r.net)])];
  for (const [cur, t] of Object.entries(report.totals)) lines.push(["", "TOTAL", "", "", "", "", "", "", cur, num(t.total), num(t.tax), num(t.fee), num(t.net)]);
  return "﻿" + lines.map((l) => l.map(csvCell).join(",")).join("\r\n") + "\r\n"; // BOM: Excel opens it as UTF-8
}

function summaryLines(report) {
  const cur = Object.entries(report.totals);
  if (!cur.length) return ["לא היו מכירות ולא היו החזרים ב-Paddle החודש."];
  return cur.flatMap(([c, t]) => [
    `מכירות: ${t.sales}${t.adjustments ? `, החזרים וחיובים חוזרים: ${t.adjustments}` : ""}`,
    `סך הכול ששילמו הלקוחות (כולל מס): ${money(t.total, c)}`,
    `מס (מע"מ / Sales tax) ש-Paddle גובה ומעביר לרשויות: ${money(t.tax, c)}`,
    `עמלת Paddle: ${money(t.fee, c)}`,
    `נטו לתשלום לטניה: ${money(t.net, c)}`,
  ]);
}

export function reportText(report) {
  const lines = [`דוח הכנסות Paddle, ${report.month.label}`, "", ...summaryLines(report)];
  if (report.byProduct.length > 1) {
    lines.push("", "לפי מוצר:");
    for (const p of report.byProduct) lines.push(`${p.product}: ${p.sales} מכירות, נטו ${money(p.net, p.currency)}`);
  }
  lines.push(
    "",
    "הפירוט המלא, עסקה עסקה, בקובץ ה-CSV המצורף.",
    "",
    "הערות:",
    "Paddle הוא ה-Merchant of Record: הלקוחות קונים מ-Paddle, ו-Paddle מעביר לטניה את הנטו.",
    "זה סיכום מכירות לפי תאריך החיוב (שעון ישראל). ה-Payout עצמו יוצא בלוח הזמנים של Paddle, ודוח ה-Payout נמצא בדשבורד של Paddle.",
    "הדוח כולל את כל המוצרים בחשבון ה-Paddle.",
    "",
    "נשלח אוטומטית מ-tadamevents.com",
  );
  return lines.join("\n");
}

const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function reportHtml(report) {
  const cell = "padding:8px 12px;border-bottom:1px solid #e3e8fb;";
  const rows = Object.entries(report.totals).flatMap(([c, t]) => [
    ["מכירות", String(t.sales)],
    ...(t.adjustments ? [["החזרים וחיובים חוזרים", String(t.adjustments)]] : []),
    ["סך הכול ששילמו הלקוחות (כולל מס)", money(t.total, c)],
    ["מס ש-Paddle גובה ומעביר לרשויות", money(t.tax, c)],
    ["עמלת Paddle", money(t.fee, c)],
    ["<strong>נטו לתשלום לטניה</strong>", `<strong>${esc(money(t.net, c))}</strong>`],
  ]);
  const table = rows.length
    ? `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;">${rows.map(([k, v]) => `<tr><td style="${cell}">${k.startsWith("<") ? k : esc(k)}</td><td style="${cell}direction:ltr;text-align:left;">${v.startsWith("<") ? v : esc(v)}</td></tr>`).join("")}</table>`
    : `<p>לא היו מכירות ולא היו החזרים ב-Paddle החודש.</p>`;
  const products =
    report.byProduct.length > 1
      ? `<p style="margin:16px 0 4px;"><strong>לפי מוצר</strong></p><ul style="margin:0;padding-right:20px;">${report.byProduct.map((p) => `<li>${esc(p.product)}: ${p.sales} מכירות, נטו <span dir="ltr">${esc(money(p.net, p.currency))}</span></li>`).join("")}</ul>`
      : "";
  return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>דוח הכנסות Paddle, ${esc(report.month.label)}</title></head>
<body dir="rtl" style="margin:0;padding:24px;font:15px/1.6 Arial,Helvetica,sans-serif;color:#00176a;text-align:right;">
<h1 style="font-size:22px;margin:0 0 8px;">דוח הכנסות Paddle, ${esc(report.month.label)}</h1>
${table}${products}
<p>הפירוט המלא, עסקה עסקה, בקובץ ה-CSV המצורף.</p>
<p style="color:#5a6aa8;font-size:13px;">Paddle הוא ה-Merchant of Record: הלקוחות קונים מ-Paddle, ו-Paddle מעביר לטניה את הנטו. זה סיכום מכירות לפי תאריך החיוב (שעון ישראל). ה-Payout עצמו יוצא בלוח הזמנים של Paddle, ודוח ה-Payout נמצא בדשבורד של Paddle. הדוח כולל את כל המוצרים בחשבון ה-Paddle.</p>
<p style="color:#5a6aa8;font-size:13px;">נשלח אוטומטית מ-tadamevents.com</p>
</body></html>`;
}

/** Builds and emails the report for `month`. Returns { ok, status, error, report }. */
export async function sendIncomeReport(month, env = process.env) {
  if (!env.PADDLE_API_KEY) return { ok: false, status: 0, error: "PADDLE_API_KEY is not set" };
  if (!env.RESEND_API_KEY) return { ok: false, status: 0, error: "RESEND_API_KEY is not set" };
  const [transactions, adjustments] = await Promise.all([fetchTransactions(month, env), fetchAdjustments(month, env)]);
  const report = buildReport(transactions, adjustments, month);
  const to = (env.REPORT_EMAIL_TO || env.ORDER_EMAIL_TO || "hey@tadamevents.com").split(",").map((s) => s.trim()).filter(Boolean);
  const sandbox = /^pdl_sdbx_/.test(env.PADDLE_API_KEY) || apiBase(env).includes("sandbox");
  const body = {
    from: env.REPORT_EMAIL_FROM || "Tadam! reports <orders@tadamevents.com>",
    to,
    subject: `${sandbox ? "[SANDBOX] " : ""}דוח הכנסות Paddle, ${report.month.label}`,
    text: reportText(report),
    html: reportHtml(report),
    attachments: [{ filename: `paddle-income-${report.month.key}.csv`, content: Buffer.from(reportCsv(report)).toString("base64"), content_type: "text/csv" }],
  };
  let res;
  try {
    res = await fetch(env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `income-report/${report.month.key}${sandbox ? "/sandbox" : ""}` },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, status: 0, error: String(err?.message || err), report };
  }
  if (res.ok) return { ok: true, status: res.status, report };
  return { ok: false, status: res.status, error: (await res.text()).slice(0, 500), report };
}
