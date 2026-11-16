/**
 * Analytics stub. No vendor yet.
 * Swap the body of `track` for GA4 / Plausible / PostHog later.
 */
export type TrackEvent =
  | "demo_modal_open"
  | "demo_modal_close"
  | "demo_qr_shown"
  | "demo_open_big_screen"
  | "demo_play_on_phone"
  | "demo_send_to_desktop"
  | "demo_iframe_fallback"
  | "cta_create_click"
  | "pricing_view"
  | "cta_whatsapp_click"
  | "cta_how_it_works_click"
  | "faq_open";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: TrackEvent, props: Record<string, unknown> = {}) {
  const payload = { event, ...props, ts: Date.now() };
  (window.dataLayer ||= []).push(payload);
  if (import.meta.env.DEV) console.debug("[track]", payload);
}
