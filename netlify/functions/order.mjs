// POST /api/order: the game creator (/create) sends the finished order here just before the Paddle checkout opens.
// The order (fields + brief-json) and up to 5 photos are kept in Netlify Blobs, store "orders" on production and
// "orders-test" on deploy previews and local runs, under the order id. Status "awaiting-payment" until Paddle's
// webhook (paddle-webhook.mjs) marks it paid and emails the team.
// See the orders: Netlify > tadam-us > Blobs, or ask Claude to list them with the Netlify CLI.
import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { ORDER_FIELDS, ORDER_ID, PACKAGES, ordersStore } from "../lib/orders.mjs";

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
const MAX_TEXT = 60_000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

export default async (req, context) => {
  if (req.method !== "POST") return json(405, { error: "method" });

  let form;
  try {
    form = await req.formData();
  } catch {
    return json(400, { error: "body" });
  }
  const field = (k) => String(form.get(k) ?? "").slice(0, MAX_TEXT).trim();

  const order = Object.fromEntries(ORDER_FIELDS.map((k) => [k, field(k)]));
  if (!ORDER_ID.test(order["order-id"])) return json(400, { error: "order-id" });
  if (!EMAIL.test(order.email) || order.email.length > 120) return json(400, { error: "email" });
  if (!PACKAGES.includes(order.package)) return json(400, { error: "package" });
  // A random secret made with the draft in the browser: only that browser can send the same order again.
  const token = field("token");
  if (!/^[A-Za-z0-9-]{20,64}$/.test(token)) return json(400, { error: "token" });
  const tokenHash = createHash("sha256").update(token).digest("hex");
  try {
    JSON.parse(order["brief-json"]);
  } catch {
    return json(400, { error: "brief-json" });
  }

  const photos = [];
  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const f = form.get(`photo-${i}`);
    if (!f || typeof f === "string") continue;
    if (!f.type.startsWith("image/") || f.size > MAX_PHOTO_BYTES) return json(400, { error: `photo-${i}` });
    photos.push({ field: `photo-${i}`, name: f.name.slice(0, 120), type: f.type, file: f });
  }

  const store = getStore({ name: ordersStore(context), consistency: "strong" });
  const id = order["order-id"];
  const previous = await store.get(`${id}/order.json`, { type: "json" });
  // The same draft may be sent again (the customer closed the checkout and pressed again): allow it only from the
  // browser that made it (same secret token), and never change an order once Paddle reported a payment.
  if (previous && (previous.status !== "awaiting-payment" || previous.tokenHash !== tokenHash)) {
    return json(409, { error: "exists" });
  }

  const now = new Date().toISOString();
  for (const old of previous?.photos ?? []) await store.delete(`${id}/${old.field}`);
  for (const p of photos) {
    await store.set(`${id}/${p.field}`, await p.file.arrayBuffer(), { metadata: { name: p.name, type: p.type } });
  }
  await store.setJSON(`${id}/order.json`, {
    ...order,
    status: "awaiting-payment",
    tokenHash,
    photos: photos.map(({ field, name, type }) => ({ field, name, type })),
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  });
  console.log(`Order ${id} saved (${order.package}, ${photos.length} photos)`);
  return json(200, { ok: true, orderId: id });
};

export const config = { path: "/api/order" };
