/**
 * Paddle checkout settings for /create, read at build time from Netlify environment variables
 * (Netlify > tadam-us > Site configuration > Environment variables). None of these are secrets: Paddle's client-side
 * token and price ids are meant to be in the page. The webhook secret is separate and server-only (PADDLE_WEBHOOK_SECRET).
 *
 *   PUBLIC_PADDLE_ENV            "sandbox" (test payments) or "production"
 *   PUBLIC_PADDLE_CLIENT_TOKEN   Paddle > Developer tools > Authentication > Client-side tokens
 *   PUBLIC_PADDLE_PRICE_BASIC    Paddle > Catalog > Products > Basic > price id (pri_...)
 *   PUBLIC_PADDLE_PRICE_VIP      Paddle > Catalog > Products > VIP > price id (pri_...)
 *
 * Set the sandbox values for "Deploy previews" and the live values for "Production" only once Paddle approves the site.
 * Without a token, the wizard still saves the order and shows a placeholder screen instead of the checkout.
 */
const env = import.meta.env;

export const CHECKOUT = {
  env: (env.PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox") as "production" | "sandbox",
  token: (env.PUBLIC_PADDLE_CLIENT_TOKEN as string | undefined) || "",
  prices: {
    basic: (env.PUBLIC_PADDLE_PRICE_BASIC as string | undefined) || "",
    vip: (env.PUBLIC_PADDLE_PRICE_VIP as string | undefined) || "",
  } as Record<string, string>,
};
