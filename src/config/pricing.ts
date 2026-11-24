/**
 * Pricing + the link into the creation flow. One place for every number on the page.
 * Copy never contains a price: copy.en.ts uses {placeholders} (see `fillPrices`), the Pricing component reads the numbers.
 *
 * Set on 2026-11-23 (docs/paddle/HANDOFF.md): $99 per game, one-time. Paddle is the merchant of record and converts
 * to other currencies (EUR, GBP...) at checkout, and adds sales tax or VAT there.
 */

/**
 * The creation flow (wizard) behind every "Create yours" button.
 * TODO (Tanya, plan step A.4): today this is the Base44 wizard, where payment is still a simulation. Point it at the
 * English wizard with Paddle checkout when it exists. Never put a personal `?id=` link here.
 */
export const CREATE_URL = "https://tadam.base44.app/create";

export const PRICING = {
  /** Shown next to the number. */
  currency: "$",
  /** ISO code for structured data. */
  currencyCode: "USD",
  /** One personal game, one-time payment. */
  base: 99,
  /** Days to ask for a full refund (docs/paddle/refund-policy.md). */
  refundDays: 14,
  /** Days the game link works before the game and its content are deleted. */
  linkDays: 30,
  /** Hours from payment to delivery of the game link. */
  deliveryHours: 24,
};

/** "$99" for running text. */
export const money = (n: number) => `${PRICING.currency}${n}`;

const tokens: Record<string, string> = {
  base: money(PRICING.base),
  refundDays: String(PRICING.refundDays),
  linkDays: String(PRICING.linkDays),
  deliveryHours: String(PRICING.deliveryHours),
};

/** Replaces {base}, {refundDays}, {linkDays}, {deliveryHours} in copy. */
export const fillPrices = (text: string) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
