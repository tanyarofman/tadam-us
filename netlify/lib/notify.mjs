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

// The customer email is sent from our own address, so text the customer typed is kept short and plain: anyone who
// pays could otherwise use it to send a message (a link, extra lines) under the Tadam! name.

/** "2027-01-20" → "January 20, 2027"; anything else is left out. */
function longDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(v || ""))) return "";
  const d = new Date(`${v}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { timeZone: "UTC", dateStyle: "long" });
}

/** The game title on one line, at most 80 characters, with no links or web addresses; "" if nothing usable is left. */
function safeTitle(v) {
  let t = String(v || "").replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g, " ").replace(/\s+/g, " ").trim();
  if (/(https?:|www\.|\b[a-z0-9-]+\.(com|net|org|io|co|ly|xyz|info|app|me|link)\b)/i.test(t)) return "";
  if (t.length > 80) t = `${t.slice(0, 77).trimEnd()}...`;
  return t;
}

/** Plain text, American English, no dashes as punctuation (site copy rules). */
export function customerEmailText(order) {
  const clean = safeTitle(order["game-title"]);
  const title = clean ? `"${clean}"` : "your game";
  const lines = [
    "Hi,",
    "",
    `Thank you for your order! We received your payment and the stories for ${title}.`,
    "",
    `Order number: ${order["order-id"]}`,
  ];
  if (PACKAGE_NAMES[order.package]) lines.push(`Package: ${PACKAGE_NAMES[order.package]}`);
  const date = longDate(order["event-date"]);
  if (date) lines.push(`Event date: ${date}`);
  lines.push(
    "",
    "What happens next",
    "1. We build your game from the stories and photos you sent.",
    "2. The game arrives by email within 72 hours, and you can ask for changes before the event.",
    "",
    "Your receipt comes separately from Paddle, our payment provider. On your card statement, the charge shows as PADDLE.NET* VELONOVA.",
    "",
    "Remembered another story, or have a question? Just reply to this email.",
    "",
    "The Tadam! team",
    "https://tadamevents.com",
  );
  return lines.join("\n");
}

const esc = (v) => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const SITE = "https://tadamevents.com";
const FONT = "'Almoni',Arial,Helvetica,sans-serif";

/** Branded HTML version of customerEmailText: same words, table layout and inline CSS for Gmail, Apple Mail, Outlook. */
export function customerEmailHtml(order) {
  const clean = safeTitle(order["game-title"]);
  const title = clean ? `&ldquo;${esc(clean)}&rdquo;` : "your game";
  const rows = [["Order number", esc(order["order-id"] || "")]];
  if (PACKAGE_NAMES[order.package]) rows.push(["Package", PACKAGE_NAMES[order.package]]);
  const date = longDate(order["event-date"]);
  if (date) rows.push(["Event date", esc(date)]);
  const detail = rows
    .map(([k, v], i) => `<tr><td style="padding:${i ? "10px" : "0"} 0 0;font:15px/1.4 ${FONT};color:#5a6aa8;">${k}</td><td align="right" style="padding:${i ? "10px" : "0"} 0 0;font:bold 16px/1.4 ${FONT};color:#00176a;">${v}</td></tr>`)
    .join("");
  const step = (n, text) => `<tr><td width="40" valign="top" style="padding:0 0 14px;"><div style="width:30px;height:30px;line-height:30px;border-radius:15px;background:#ffe600;color:#00176a;font:bold 16px/30px ${FONT};text-align:center;">${n}</div></td><td valign="top" style="padding:4px 0 14px;font:16px/1.5 ${FONT};color:#00176a;">${text}</td></tr>`;
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Your Tadam! game is on its way</title>
<style>@font-face{font-family:'Almoni';font-weight:400;src:url(${SITE}/fonts/almoni-tzar-regular-aaa.otf) format('opentype');}@font-face{font-family:'Almoni';font-weight:700;src:url(${SITE}/fonts/almoni-tzar-bold-aaa.otf) format('opentype');}@media (max-width:620px){.card{padding:28px 22px !important}.h1{font-size:28px !important}}</style></head>
<body style="margin:0;padding:0;background:#00176a;">
<div style="display:none;max-height:0;overflow:hidden;">Order ${esc(order["order-id"] || "")}: we received your payment and your stories.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#00176a;"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td align="center" style="padding:8px 0 24px;"><a href="${SITE}"><img src="${SITE}/brand/tadam-logo-email.png" width="200" height="79" alt="Tadam!" style="display:block;border:0;width:200px;height:auto;"></a></td></tr>
<tr><td style="background:#e836a1;height:6px;line-height:6px;font-size:0;border-radius:20px 20px 0 0;">&nbsp;</td></tr>
<tr><td class="card" style="background:#ffffff;padding:36px 40px;border-radius:0 0 20px 20px;">
<p style="margin:0 0 8px;font:bold 14px/1.4 ${FONT};letter-spacing:1px;text-transform:uppercase;color:#e836a1;">Order confirmed</p>
<h1 class="h1" style="margin:0 0 16px;font:bold 32px/1.15 ${FONT};color:#00176a;">Thank you for your order!</h1>
<p style="margin:0 0 24px;font:17px/1.5 ${FONT};color:#00176a;">Hi, we received your payment and the stories for ${title}.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f4ff;border-radius:12px;"><tr><td style="padding:18px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detail}</table></td></tr></table>
<h2 style="margin:30px 0 14px;font:bold 22px/1.2 ${FONT};color:#00176a;">What happens next</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${step(1, "We build your game from the stories and photos you sent.")}${step(2, "The game arrives by email, and you can ask for changes before the event.")}</table>
<p style="margin:10px 0 0;font:15px/1.5 ${FONT};color:#5a6aa8;">Your receipt comes separately from Paddle, our payment provider. On your card statement, the charge shows as <strong>PADDLE.NET* VELONOVA</strong>.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;border-top:1px solid #e3e8fb;"><tr><td style="padding-top:24px;font:17px/1.5 ${FONT};color:#00176a;">Remembered another story, or have a question? <strong>Just reply to this email.</strong></td></tr></table>
<p style="margin:24px 0 0;font:bold 17px/1.5 ${FONT};color:#00176a;">The Tadam! team</p>
</td></tr>
<tr><td align="center" style="padding:28px 0 0;"><a href="${SITE}" style="display:inline-block;background:#ffe600;color:#00176a;font:bold 17px/1 ${FONT};text-decoration:none;padding:14px 30px;border-radius:999px;">Visit tadamevents.com</a></td></tr>
<tr><td align="center" style="padding:24px 0 8px;font:13px/1.5 ${FONT};color:#a9b6f0;">Tadam! &middot; <a href="mailto:hey@tadamevents.com" style="color:#a9b6f0;">hey@tadamevents.com</a><br>Payments processed by Paddle.com</td></tr>
</table></td></tr></table></body></html>`;
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
    html: customerEmailHtml(order),
  };
  return resendPost(key, body, `order-confirm/${order["order-id"]}`, env);
}
