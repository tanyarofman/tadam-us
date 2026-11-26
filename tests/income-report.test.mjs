import { test } from "node:test";
import assert from "node:assert/strict";
import { apiBase, buildReport, monthFor, previousMonth, reportCsv, reportHtml, reportText, sendIncomeReport } from "../netlify/lib/income-report.mjs";

const tx = (id, billed, product, payout, customer = { currency: "USD", total: payout.total }) => ({
  id,
  status: "completed",
  billed_at: billed,
  currency_code: customer.currency,
  invoice_number: `INV-${id}`,
  details: {
    totals: { grand_total: String(customer.total), total: String(customer.total), currency_code: customer.currency },
    payout_totals: { ...Object.fromEntries(Object.entries(payout).map(([k, v]) => [k, String(v)])), currency_code: "USD" },
    line_items: [{ product: { name: product } }],
  },
});

test("previous month uses Israel time boundaries", () => {
  // 1 Dec 2026 06:00 UTC = 08:00 in Israel → November 2026
  const m = previousMonth(new Date("2026-12-01T06:00:00Z"));
  assert.equal(m.key, "2026-11");
  assert.equal(m.label, "נובמבר 2026");
  assert.equal(m.start.toISOString(), "2026-10-31T22:00:00.000Z"); // Israel is UTC+2 on 1 Nov
  assert.equal(m.end.toISOString(), "2026-11-30T22:00:00.000Z");
  // January report wraps the year; summer month uses UTC+3
  assert.equal(previousMonth(new Date("2027-01-01T06:00:00Z")).key, "2026-12");
  assert.equal(monthFor(2026, 7).start.toISOString(), "2026-06-30T21:00:00.000Z");
});

test("sandbox keys read the sandbox API", () => {
  assert.equal(apiBase({ PADDLE_API_KEY: "pdl_sdbx_apikey_x" }), "https://sandbox-api.paddle.com");
  assert.equal(apiBase({ PADDLE_API_KEY: "pdl_live_apikey_x" }), "https://api.paddle.com");
});

test("report sums sales minus refunds, per currency and product", () => {
  const month = monthFor(2026, 11);
  const sales = [
    tx("txn_1", "2026-11-03T10:00:00Z", "Tadam! Basic", { total: 9900, tax: 0, fee: 545, earnings: 9355 }),
    tx("txn_2", "2026-11-10T10:00:00Z", "Tadam! VIP", { total: 17880, tax: 2980, fee: 940, earnings: 13960 }, { currency: "EUR", total: 16500 }),
  ];
  const refunds = [{ id: "adj_1", action: "refund", transaction_id: "txn_1", created_at: "2026-11-12T10:00:00Z", currency_code: "USD", totals: { total: "9900" }, payout_totals: { total: "9900", tax: "0", fee: "0", earnings: "9900", currency_code: "USD" } }];
  const r = buildReport(sales, refunds, month);
  assert.deepEqual(r.totals.USD, { sales: 2, adjustments: 1, total: 178.8, tax: 29.8, fee: 14.85, net: 134.15 });
  assert.equal(r.rows[2].type, "Refund");
  assert.equal(r.rows[2].product, "Tadam! Basic");
  assert.equal(r.byProduct.length, 2);

  const csv = reportCsv(r);
  assert.match(csv, /^﻿Date \(Israel\),Type/);
  assert.match(csv, /2026-11-10,Sale,txn_2,txn_2,INV-txn_2,Tadam! VIP,EUR,165\.00,USD,178\.80,29\.80,9\.40,139\.60/);
  assert.match(csv, /,TOTAL,.*,USD,178\.80,29\.80,14\.85,134\.15/);

  const text = reportText(r);
  assert.match(text, /נובמבר 2026/);
  assert.match(text, /\$134\.15/);
  assert.match(reportHtml(r), /dir="rtl"/);
  assert.doesNotMatch(text + reportHtml(r), /[–—]/);
});

test("empty month still produces a report", () => {
  const r = buildReport([], [], monthFor(2026, 11));
  assert.match(reportText(r), /לא היו מכירות/);
  assert.equal(reportCsv(r).trim().split("\n").length, 1);
});

test("CSV neutralises formula-looking text", () => {
  const r = buildReport([tx("txn_3", "2026-11-03T10:00:00Z", "=HYPERLINK(1)", { total: 100, tax: 0, fee: 0, earnings: 100 })], [], monthFor(2026, 11));
  assert.match(reportCsv(r), /'=HYPERLINK\(1\)/);
});

test("sendIncomeReport pages Paddle, stops adjustments at the month start, emails the CSV", async () => {
  const month = monthFor(2026, 11);
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    const u = new URL(url);
    const json = (b) => new Response(JSON.stringify(b), { status: 200 });
    if (u.pathname === "/transactions" && !u.searchParams.get("after")) {
      return json({ data: [tx("txn_1", "2026-11-03T10:00:00Z", "Tadam! Basic", { total: 9900, tax: 0, fee: 545, earnings: 9355 })], meta: { pagination: { has_more: true, next: "https://paddle.test/transactions?after=txn_1" } } });
    }
    if (u.pathname === "/transactions") return json({ data: [tx("txn_2", "2026-11-04T10:00:00Z", "Tadam! Basic", { total: 9900, tax: 0, fee: 545, earnings: 9355 })], meta: { pagination: { has_more: false } } });
    if (u.pathname === "/adjustments") {
      return json({
        data: [
          { id: "adj_late", action: "refund", created_at: "2026-12-01T10:00:00Z", payout_totals: { total: "1", earnings: "1", currency_code: "USD" } },
          { id: "adj_old", action: "refund", created_at: "2026-10-20T10:00:00Z", payout_totals: { total: "1", earnings: "1", currency_code: "USD" } },
        ],
        meta: { pagination: { has_more: true, next: "https://paddle.test/adjustments?after=adj_old" } },
      });
    }
    if (u.hostname === "resend.test") return new Response("{}", { status: 200 });
    throw new Error(`unexpected ${url}`);
  };
  try {
    const env = { PADDLE_API_KEY: "pdl_sdbx_apikey_x", PADDLE_API_URL: "https://paddle.test", RESEND_API_KEY: "re_x", RESEND_API_URL: "https://resend.test/emails", REPORT_EMAIL_TO: "a@example.com, b@example.com" };
    const res = await sendIncomeReport(month, env);
    assert.equal(res.ok, true, res.error);
    assert.equal(res.report.totals.USD.sales, 2);
    assert.equal(res.report.totals.USD.adjustments, 0);
    assert.equal(calls.filter((c) => c.url.includes("/adjustments")).length, 1, "stops paging adjustments once older than the month");
    const first = new URL(calls[0].url);
    assert.equal(first.searchParams.get("billed_at[GTE]"), "2026-10-31T22:00:00.000Z");
    assert.equal(calls[0].init.headers.Authorization, "Bearer pdl_sdbx_apikey_x");
    const mail = calls.find((c) => c.url.startsWith("https://resend.test"));
    const body = JSON.parse(mail.init.body);
    assert.deepEqual(body.to, ["a@example.com", "b@example.com"]);
    assert.match(body.subject, /^\[SANDBOX\] דוח הכנסות Paddle, נובמבר 2026$/);
    assert.equal(body.attachments[0].filename, "paddle-income-2026-11.csv");
    assert.equal(mail.init.headers["Idempotency-Key"], "income-report/2026-11/sandbox");
  } finally {
    globalThis.fetch = realFetch;
  }
});
