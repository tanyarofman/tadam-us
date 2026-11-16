/**
 * Pricing + the link into the creation flow. One place for every number on the page.
 * Markup and copy never contain a price: copy.he.ts uses {placeholders} (see `fillPrices`),
 * the Pricing component reads the numbers below. Changing a price is a one-line edit here.
 *
 * "real" = taken from Ilan's page (https://tadam.base44.app/, checked 2026-11-16).
 * "proposal" = Tanya's idea, not confirmed yet.
 */

/**
 * The creation flow (wizard) of the game.
 * TODO confirm with Ilan: today it lives on base44. Never put a personal `?id=` link here.
 */
export const CREATE_URL = "https://tadam.base44.app/create";

export const PRICING = {
  currency: "₪",

  /** Personal game for an event. real */
  base: 250,
  /** Each extra edit of an already produced game. real */
  edit: 50,

  /** Add-on: friends/kids also get a contributor link (parents still approve every item). */
  contributorLink: 50, // TODO confirm (proposal)
  /** Add-on: a personal custom host made for the event (one of the ready-made hosts is included). */
  personalHost: { from: 100, to: 300 }, // TODO confirm (proposal, range)
  /** Ready-made hosts included in the base price. */
  readyMadeHosts: 5, // TODO confirm
};

const nbsp = " ";
/** "250 ₪" for running text (FAQ). */
export const money = (n: number) => `${n}${nbsp}${PRICING.currency}`;

const tokens: Record<string, string> = {
  base: money(PRICING.base),
  edit: money(PRICING.edit),
  contributorLink: money(PRICING.contributorLink),
  hostFrom: money(PRICING.personalHost.from),
  hostTo: money(PRICING.personalHost.to),
  readyMadeHosts: String(PRICING.readyMadeHosts),
};

/** Replaces {base}, {edit}, {contributorLink}, {hostFrom}, {hostTo}, {readyMadeHosts} in copy. */
export const fillPrices = (text: string) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
