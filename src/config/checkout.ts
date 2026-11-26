/**
 * Paddle checkout settings for /create, fixed at build time. None of these are secrets: Paddle's client-side token and
 * price ids are meant to be in the page. The webhook secret is separate and server-only (PADDLE_WEBHOOK_SECRET).
 *
 * Deploy previews and local runs use the Paddle SANDBOX below (set up 2026-11-26, confirmed by Tanya; also in PR #63,
 * src/config/paddle.ts), so test payments work without any setup.
 * Production (tadamevents.com) uses ONLY the Netlify environment variables, so it never takes sandbox payments:
 *
 *   PUBLIC_PADDLE_ENV            "production" (or "sandbox")
 *   PUBLIC_PADDLE_CLIENT_TOKEN   Paddle > Developer tools > Authentication > Client-side tokens
 *   PUBLIC_PADDLE_PRICE_BASIC    Paddle > Catalog > Basic > price id (pri_...)
 *   PUBLIC_PADDLE_PRICE_VIP      Paddle > Catalog > VIP > price id (pri_...)
 *
 * Set them in Netlify > tadam-us > Environment variables, scope Production, once Paddle approves the live account.
 * Without a token, the wizard still saves the order and shows a placeholder screen instead of the checkout.
 * The webhook (netlify/lib/orders.mjs) maps the same price ids back to packages.
 */
export const PADDLE_SANDBOX = {
  token: "test_1cdab59c87fd6e5f38edf3d019d",
  prices: { basic: "pri_01m8bgmwct32162zqxk7q9s3bv", vip: "pri_01m8bgkrvfe70qyd87hvg93cf8" },
};

const env = import.meta.env;
/** Netlify sets CONTEXT during the build: "production", "deploy-preview" or "branch-deploy". Unset locally. */
const production = process.env.CONTEXT === "production";
const fromEnv = !!env.PUBLIC_PADDLE_CLIENT_TOKEN;
const sandboxDefault = !production && !fromEnv;

export const CHECKOUT = {
  env: (sandboxDefault || env.PUBLIC_PADDLE_ENV !== "production" ? "sandbox" : "production") as "production" | "sandbox",
  token: sandboxDefault ? PADDLE_SANDBOX.token : ((env.PUBLIC_PADDLE_CLIENT_TOKEN as string | undefined) || ""),
  prices: (sandboxDefault
    ? PADDLE_SANDBOX.prices
    : { basic: (env.PUBLIC_PADDLE_PRICE_BASIC as string | undefined) || "", vip: (env.PUBLIC_PADDLE_PRICE_VIP as string | undefined) || "" }) as Record<
    string,
    string
  >,
};
