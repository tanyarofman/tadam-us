// POST /api/paddle-webhook: Paddle calls this when a payment goes through (events transaction.completed and
// transaction.paid). Set it up in Paddle > Developer tools > Notifications: destination
// https://<site>/api/paddle-webhook, those two events; put the destination's secret key in the Netlify environment
// variable PADDLE_WEBHOOK_SECRET (one value for sandbox on deploy previews, one for live on production).
//
// What it does: checks Paddle's signature, finds the order by the id the checkout carried (customData.orderId),
// marks it paid in Netlify Blobs, and emails it with its photos to the team through Resend (netlify/lib/notify.mjs).
// Payment and order are matched automatically; nobody has to compare emails.
// Before building a game, the transaction id in the email can be checked against Paddle > Transactions. (Needed when
// the Netlify form fallback is used: that form is public, so anyone could post a fake "paid" order to it.)
import { createHmac, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { ORDER_FIELDS, ORDER_ID, ordersStore, packageOfPrice } from "../lib/orders.mjs";
import { sendCustomerEmail, sendOrderEmail } from "../lib/notify.mjs";

const EVENTS = new Set(["transaction.completed", "transaction.paid"]);
/** Paddle signs each delivery with a timestamp; refuse old ones so a captured request cannot be replayed. */
const MAX_AGE_S = 300;

function verify(raw, header, secret) {
  const parts = Object.fromEntries(
    String(header || "")
      .split(";")
      .map((kv) => kv.split("=")),
  );
  if (!parts.ts || !parts.h1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.ts)) > MAX_AGE_S) return false;
  const expected = createHmac("sha256", secret).update(`${parts.ts}:${raw}`).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(parts.h1, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

const money = (minor, currency) => (minor ? `${(Number(minor) / 100).toFixed(2)} ${currency || ""}`.trim() : "");

export default async (req, context) => {
  if (req.method !== "POST") return new Response("method", { status: 405 });
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Paddle webhook: PADDLE_WEBHOOK_SECRET is not set");
    return new Response("not configured", { status: 500 });
  }
  const raw = await req.text();
  if (!verify(raw, req.headers.get("paddle-signature"), secret)) return new Response("signature", { status: 401 });

  const event = JSON.parse(raw);
  if (!EVENTS.has(event.event_type)) return new Response("ignored", { status: 200 });

  const tx = event.data || {};
  const id = tx.custom_data?.orderId;
  if (!ORDER_ID.test(String(id || ""))) {
    console.error(`Paddle webhook: transaction ${tx.id} has no order id`, tx.custom_data);
    return new Response("no order id", { status: 200 }); // nothing to retry: tell the team by hand
  }

  const store = getStore({ name: ordersStore(context), consistency: "strong" });
  const order = await store.get(`${id}/order.json`, { type: "json" });
  if (!order) {
    console.error(`Paddle webhook: order ${id} (transaction ${tx.id}) not found`);
    return new Response("order not found", { status: 404 }); // Paddle retries; the order may still be saving
  }
  if (order.status !== "awaiting-payment") return new Response(`already ${order.status}`, { status: 200 });

  const totals = tx.details?.totals || {};
  // The package comes only from what Paddle says was bought, never from what the browser sent. An unknown price
  // (or a package different from the order) is flagged for a person to check instead of being treated as paid.
  const priceId = tx.items?.[0]?.price?.id;
  const paidPackage = packageOfPrice(priceId);
  // Exactly one game: a quantity above 1 (if the checkout ever allows it) goes to a person to check.
  const ok = !!paidPackage && tx.items?.length === 1 && Number(tx.items[0].quantity ?? 1) === 1;
  if (!ok) console.error(`Paddle webhook: order ${id}, transaction ${tx.id}: unexpected items`, tx.items);
  const paid = {
    ...order,
    status: ok ? "paid" : "needs-review",
    package: paidPackage || `unknown price ${priceId || "-"}`,
    paid: money(totals.grand_total, totals.currency_code || tx.currency_code),
    transaction: tx.id || "",
    paidAt: new Date().toISOString(),
  };

  // One email to the team per paid order, with the photos attached. Resend when RESEND_API_KEY is set (netlify/lib/
  // notify.mjs); otherwise the Netlify form "order" (registered in Flow.astro), which Netlify may file as spam.
  const photos = [];
  for (const p of order.photos || []) {
    const bytes = await store.get(`${id}/${p.field}`, { type: "arrayBuffer" });
    if (bytes) photos.push({ field: p.field, name: p.name || `${p.field}.jpg`, type: p.type, bytes });
  }
  if (process.env.RESEND_API_KEY) {
    const sent = await sendOrderEmail(paid, photos);
    if (!sent.ok) {
      console.error(`Paddle webhook: Resend email for ${id} failed with HTTP ${sent.status}: ${sent.error}`);
      return new Response("notify failed", { status: 502 }); // Paddle retries, and the order stays unpaid until then
    }
  } else {
    const fd = new FormData();
    fd.append("form-name", "order");
    for (const k of [...ORDER_FIELDS, "status", "paid", "transaction"]) fd.append(k, String(paid[k] ?? ""));
    for (const p of photos) fd.append(p.field, new Blob([p.bytes], { type: p.type }), p.name);
    const res = await fetch(`${new URL(req.url).origin}/`, { method: "POST", body: fd });
    if (!res.ok) {
      console.error(`Paddle webhook: Netlify form post for ${id} failed with HTTP ${res.status}`);
      return new Response("notify failed", { status: 502 });
    }
  }

  await store.setJSON(`${id}/order.json`, paid);

  // The customer's confirmation. Best effort: the order is already paid and the team has it, so a failure here is
  // only logged (a retry by Paddle would stop at "already paid" anyway).
  if (process.env.RESEND_API_KEY) {
    const conf = await sendCustomerEmail(paid);
    if (!conf.ok) console.error(`Paddle webhook: confirmation to the customer for ${id} failed (${conf.status}): ${conf.error}`);
  }
  console.log(`Order ${id} ${paid.status} (${paid.package}, ${paid.paid}, ${paid.transaction})`);
  return new Response("ok", { status: 200 });
};

export const config = { path: "/api/paddle-webhook" };
