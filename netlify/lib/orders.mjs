// Shared by netlify/functions/order.mjs and paddle-webhook.mjs.

/** The order fields the wizard sends (src/scripts/create.ts) and the Netlify form "order" receives (Flow.astro). */
export const ORDER_FIELDS = [
  "order-id",
  "package",
  "email",
  "event",
  "about",
  "game-title",
  "host",
  "event-date",
  "guests",
  "brief",
  "brief-json",
];

/** Made in the browser: "TD-" + time + random. */
export const ORDER_ID = /^TD-[A-Z0-9]{4,16}$/;

/** Package ids, as in PACKAGES in src/config/pricing.ts. */
export const PACKAGES = ["basic", "vip"];

/** Production orders and test orders (deploy previews, local runs) never mix. */
export const ordersStore = (context) => (context?.deploy?.context === "production" ? "orders" : "orders-test");

/**
 * Paddle price id → package id. Sandbox ids are the defaults in src/config/checkout.ts; live ids come from the
 * production environment variables. An unknown price id is never treated as a paid package.
 */
const SANDBOX_PRICES = { pri_01m8bgmwct32162zqxk7q9s3bv: "basic", pri_01m8bgkrvfe70qyd87hvg93cf8: "vip" };
export function packageOfPrice(priceId) {
  if (!priceId) return "";
  if (priceId === process.env.PUBLIC_PADDLE_PRICE_BASIC) return "basic";
  if (priceId === process.env.PUBLIC_PADDLE_PRICE_VIP) return "vip";
  return SANDBOX_PRICES[priceId] || "";
}
