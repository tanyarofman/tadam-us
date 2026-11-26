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
 * When the live account is approved, add its token and price IDs under `live` and switch `environment`.
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
    clientToken: "",
    prices: { basic: "", vip: "" },
  },
};

/** The token and price IDs for the current environment. */
export const paddleConfig = () => (PADDLE.environment === "sandbox" ? PADDLE.sandbox : PADDLE.live);
