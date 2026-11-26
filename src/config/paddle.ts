/**
 * Paddle (merchant of record) settings for the checkout on tadamevents.com. Plan: docs/paddle/HANDOFF.md, step B.
 *
 * Everything here is PUBLIC by design: Paddle.js needs the client-side token and the price IDs in the browser.
 * Never put an API key (`pdl_...`) or a webhook secret here: those go in Netlify environment variables.
 *
 * Sandbox set up on 2026-11-26 in the sandbox account (sandbox-vendors.paddle.com):
 * - tadamevents.com is approved for checkout; default payment link https://tadamevents.com/create
 * - Products: "Tadam! Basic game" (pro_01m8bgj9fv6exae3vk09mq5wwg), "Tadam! VIP game" (pro_01m8bgjtq9ant473hng71veqmh),
 *   tax category "Standard digital goods", one-time prices in USD (Paddle converts other currencies at checkout).
 * Live account (vendors.paddle.com, seller 484499, created as Velonova; legal name to be changed to Tanya Rofman):
 * products created 2026-11-26 with the same names, tax category and one-time USD prices:
 * "Tadam! Basic game" (pro_01m8by800afwep4hcd02fsmrj9), "Tadam! VIP game" (pro_01m8by8fq6706f4r1p38de2rjw).
 * 2026-11-26: account verified, tadamevents.com approved for checkout and Apple Pay, live client-side token "tadamevents.com" created.
 * Switching `environment` to "production" (and reopening /create) is a separate step, only when Tanya says so.
 */

export type PaddleEnvironment = "sandbox" | "production";

export const PADDLE = {
  environment: "sandbox" as PaddleEnvironment,
  sandbox: {
    clientToken: "test_1cdab59c87fd6e5f38edf3d019d",
    prices: {
      /** $99, one-time. Must match PRICING.base in pricing.ts. */
      basic: "pri_01m8bgmwct32162zqxk7q9s3bv",
      /** $149, one-time. Must match PRICING.vip in pricing.ts. */
      vip: "pri_01m8bgkrvfe70qyd87hvg93cf8",
    },
  },
  live: {
    clientToken: "live_68f18404ea55f5c6b67f4f09719",
    prices: {
      basic: "pri_01m8by9ch4gja0q23j26jx3yna",
      vip: "pri_01m8byaf1safm15kd58hwaqwvq",
    },
  },
};

/** The token and price IDs for the current environment. */
export const paddleConfig = () => (PADDLE.environment === "sandbox" ? PADDLE.sandbox : PADDLE.live);
