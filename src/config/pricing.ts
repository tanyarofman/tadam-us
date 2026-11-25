/**
 * Pricing + the link into the creation flow. One place for every number on the page.
 * Copy never contains a price: copy.en.ts uses {placeholders} (see `fillPrices`), the Pricing component reads the numbers.
 *
 * Basic and VIP are one-time purchases. Both enter the same creation flow;
 * the choices in that flow determine the final package and checkout price.
 */

/**
 * The creation flow (wizard) behind every "Create yours" button: it lives on tadamevents.com and ends in the Paddle
 * checkout (Tanya, 2026-11-24: Base44 is not part of the flow). Until the wizard exists, /create is a placeholder
 * (src/pages/create.astro) that the wizard replaces.
 */
export const CREATE_URL = "/create";

export const PRICING = {
  /** Shown next to the number. */
  currency: "$",
  /** ISO code for structured data. */
  currencyCode: "USD",
  /** One personal game, one-time payment. */
  base: 59,
  vip: 99,
  /** Days to ask for a full refund (docs/paddle/refund-policy.md). */
  refundDays: 14,
  /** Days the game link works before the game and its content are deleted. */
  linkDays: 30,
  vipLinkDays: 120,
  /** Hours from payment to delivery of the game link. */
  deliveryHours: 24,
};

export const PACKAGES = [
  { id: "basic", name: "Basic", price: PRICING.base, questions: 8, participants: 100, edits: 2, linkDays: PRICING.linkDays },
  { id: "vip", name: "VIP", price: PRICING.vip, questions: 12, participants: 600, edits: 4, linkDays: PRICING.vipLinkDays },
] as const;

/** A USD price for running text. */
export const money = (n: number) => `${PRICING.currency}${n}`;

const tokens: Record<string, string> = {
  base: money(PRICING.base),
  vip: money(PRICING.vip),
  refundDays: String(PRICING.refundDays),
  linkDays: String(PRICING.linkDays),
  vipLinkDays: String(PRICING.vipLinkDays),
  deliveryHours: String(PRICING.deliveryHours),
};

/** Replaces {base}, {refundDays}, {linkDays}, {deliveryHours} in copy. */
export const fillPrices = (text: string) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
