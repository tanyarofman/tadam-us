/**
 * Site analytics: Google Analytics 4 through gtag.js.
 * gtag.js, the consent defaults and the cookie banner live in src/components/Analytics.astro (loaded on every page by
 * Base.astro). `track()` only queues an event; GA4 sends it once gtag.js has loaded, and respects the visitor's consent.
 * Event names show up as-is in GA4 (Reports > Engagement > Events). Mark the ones that matter as key events in GA4.
 */
export type TrackEvent =
  | "demo_modal_open"
  | "demo_modal_close"
  | "demo_open_big_screen"
  | "cta_create_click"
  | "pricing_view"
  | "cta_contact_click"
  | "cta_how_it_works_click"
  | "faq_open"
  | "blog_demo_click"
  | "blog_contact_click"
  | "launch_list_submit"
  /* the game creator at /create */
  | "create_start"
  | "create_step"
  | "create_prompt_answered"
  | "create_order_submit"
  | "create_order_error"
  | "create_checkout_open"
  | "create_checkout_error"
  | "create_paid";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** Props from the call sites, renamed to GA4 parameter names (`source` would clash with GA's traffic source). */
const PARAM_NAMES: Record<string, string> = { source: "placement", q: "question" };

export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  const params: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined && v !== null && v !== "") params[PARAM_NAMES[k] ?? k] = typeof v === "string" ? v.slice(0, 100) : v;
  }
  window.gtag?.("event", event, params);
  if (import.meta.env.DEV) console.debug("[track]", event, params);
}

/** One click listener for the whole site: any element with data-track="<event>" (and optional data-source). */
export function initClickTracking() {
  document.addEventListener("click", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
    if (t) track(t.dataset.track as TrackEvent, { source: t.dataset.source });
  });
}
