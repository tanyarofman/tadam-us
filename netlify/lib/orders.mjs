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
