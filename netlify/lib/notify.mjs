// Emails the team about a paid order through Resend (https://resend.com), called by paddle-webhook.mjs.
// Netlify Forms filed server-sent submissions under Spam (no email), so the webhook mails directly instead.
//
// Netlify environment variables (server-only, never in the repo):
//   RESEND_API_KEY       Resend > API Keys, permission "Sending access". Required; without it the webhook falls back
//                        to the Netlify form "order".
//   ORDER_EMAIL_TO       who gets the order emails (comma-separated). Default hey@tadamevents.com.
//   ORDER_EMAIL_FROM     the sender. Default "Tadam! orders <orders@tadamevents.com>", which works once
//                        tadamevents.com is verified in Resend > Domains. Before that, use
//                        "Tadam! orders <onboarding@resend.dev>" with ORDER_EMAIL_TO set to the Resend account's own email.

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

const LABELS = {
  "order-id": "Order",
  status: "Status",
  package: "Package",
  paid: "Paid",
  transaction: "Paddle transaction",
  email: "Customer email",
  event: "Event",
  about: "About",
  "game-title": "Game title",
  host: "Host",
  "event-date": "Event date",
  guests: "Guests",
};

/** Plain-text body: the summary fields, then the brief exactly as the wizard wrote it. */
export function orderEmailText(order) {
  const lines = Object.entries(LABELS).map(([k, label]) => `${label}: ${order[k] || "-"}`);
  const photos = (order.photos || []).length;
  return [
    order.status === "paid" ? "A new paid Tadam! order." : "A Tadam! order needs a check: the payment didn't match a package.",
    "",
    ...lines,
    `Photos: ${photos ? `${photos} attached` : "none"}`,
    "",
    "Brief",
    "-----",
    order.brief || "-",
    "",
    "Reply to this email to write to the customer.",
  ].join("\n");
}

/**
 * Sends the email. `photos` are { name, type, bytes } to attach. Returns { ok, status, error }.
 * The Idempotency-Key makes Paddle's retries of the same order send one email, not several.
 */
export async function sendOrderEmail(order, photos = [], env = process.env) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 0, error: "RESEND_API_KEY is not set" };
  const to = (env.ORDER_EMAIL_TO || "hey@tadamevents.com").split(",").map((s) => s.trim()).filter(Boolean);
  const from = env.ORDER_EMAIL_FROM || "Tadam! orders <orders@tadamevents.com>";
  const flag = order.status === "paid" ? "" : "[CHECK] ";
  const body = {
    from,
    to,
    reply_to: order.email || undefined,
    subject: `${flag}New order ${order["order-id"]}: ${order.package} ${order.paid || ""}`.trim(),
    text: orderEmailText(order),
    // Only types order.mjs checked from the file's bytes, under a fixed name: never the customer's file name.
    attachments: photos
      .filter((p) => EXT[p.type])
      .map((p) => ({ filename: `${p.field}.${EXT[p.type]}`, content: Buffer.from(p.bytes).toString("base64"), content_type: p.type })),
  };
  let res;
  try {
    res = await fetch(env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `order-paid/${order["order-id"]}`,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, status: 0, error: String(err?.message || err) };
  }
  if (res.ok) return { ok: true, status: res.status };
  return { ok: false, status: res.status, error: (await res.text()).slice(0, 500) };
}
