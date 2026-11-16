/**
 * Pricing + the link into the creation flow. One place for every number on the page.
 * Markup and copy never contain a price: copy.he.ts uses {placeholders} (see `fillPrices`),
 * the Pricing component reads the numbers below. Changing a price is a one-line edit here.
 *
 * Set by Tanya on 2026-11-16: base 750, every extra (edit, contributor link, personal host) 50.
 */

/**
 * The creation flow (wizard) of the game.
 * TODO confirm with Ilan: today it lives on base44. Never put a personal `?id=` link here.
 */
export const CREATE_URL = "https://tadam.base44.app/create";

export const PRICING = {
  /**
   * Prices are hidden on the page for now (Tanya, 2026-11-16): the section shows "what's included"
   * without numbers, and the price FAQ is skipped. Flip to true to bring every price back.
   */
  showPrices: false,

  currency: "₪",

  /** Personal game for an event. (Ilan's page shows 250.) */
  base: 750, // TODO confirm
  /** Each extra edit of an already produced game. */
  edit: 50,

  /** Add-on: friends/kids also get a contributor link (parents still approve every item). */
  contributorLink: 50, // TODO confirm
  /** Add-on: a personal custom host made for the event (one of the ready-made hosts is included). */
  personalHost: 50, // TODO confirm
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
  personalHost: money(PRICING.personalHost),
  readyMadeHosts: String(PRICING.readyMadeHosts),
};

/** Replaces {base}, {edit}, {contributorLink}, {personalHost}, {readyMadeHosts} in copy. */
export const fillPrices = (text: string) =>
  text.replace(/\{(\w+)\}/g, (m, k: string) => tokens[k] ?? m);
