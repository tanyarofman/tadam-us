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
  return resendPost(key, body, `order-paid/${order["order-id"]}`, env);
}

async function resendPost(key, body, idempotencyKey, env) {
  let res;
  try {
    res = await fetch(env.RESEND_API_URL || "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify(body),
    });
  } catch (err) {
    return { ok: false, status: 0, error: String(err?.message || err) };
  }
  if (res.ok) return { ok: true, status: res.status };
  return { ok: false, status: res.status, error: (await res.text()).slice(0, 500) };
}

// ---- The customer's confirmation, sent once the payment is in. -------------------------------------------------
// Copy matches the thanks page (src/content/create.ts, CREATE.thanks): no delivery time is promised. No prices here
// (Paddle's receipt has them). Replies go to hey@tadamevents.com, which forwards to the team.
//   CUSTOMER_EMAIL_FROM   default "Tadam! <hey@tadamevents.com>"

const PACKAGE_NAMES = { basic: "Basic", vip: "VIP" };

/** "2027-01-20" → "January 20, 2027"; anything else is shown as it is. */
function longDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { timeZone: "UTC", dateStyle: "long" });
}

/** Plain text, American English, no dashes as punctuation (site copy rules). */
export function customerEmailText(order) {
  const title = order["game-title"] ? `"${order["game-title"]}"` : "your game";
  const lines = [
    "Hi,",
    "",
    `Thank you for your order! We received your payment and the stories for ${title}.`,
    "",
    `Order number: ${order["order-id"]}`,
  ];
  if (PACKAGE_NAMES[order.package]) lines.push(`Package: ${PACKAGE_NAMES[order.package]}`);
  if (order["event-date"]) lines.push(`Event date: ${longDate(order["event-date"])}`);
  lines.push(
    "",
    "What happens next",
    "1. We build your game from the stories and photos you sent.",
    "2. The game arrives by email, and you can ask for changes before the event.",
    "",
    "Your receipt comes separately from Paddle, our payment provider.",
    "",
    "Remembered another story, or have a question? Just reply to this email.",
    "",
    "The Tadam! team",
    "https://tadamevents.com",
  );
  return lines.join("\n");
}

export async function sendCustomerEmail(order, env = process.env) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 0, error: "RESEND_API_KEY is not set" };
  if (!order.email) return { ok: false, status: 0, error: "no customer email" };
  const body = {
    from: env.CUSTOMER_EMAIL_FROM || "Tadam! <hey@tadamevents.com>",
    to: [order.email],
    reply_to: env.ORDER_EMAIL_TO?.split(",")[0]?.trim() || "hey@tadamevents.com",
    subject: `Your Tadam! game is on its way (order ${order["order-id"]})`,
    text: customerEmailText(order),
  };
  return resendPost(key, body, `order-confirm/${order["order-id"]}`, env);
}
