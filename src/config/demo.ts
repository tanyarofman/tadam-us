/**
 * Demo handoff to the Base44 game (built by the partner).
 * The landing page links into the game, it does not rebuild it.
 */
export const DEMO = {
  hostUrl: "https://tadam.base44.app/host/afad5cb359e5", // big-screen view (current demo)
  joinUrl: "TODO_CONFIRM_WITH_PARTNER", // phone join URL for the same game
  soloUrl: "TODO_CONFIRM_WITH_PARTNER", // optional single-phone demo mode

  /**
   * As of 2026-11-15 the Base44 host page sends `X-Frame-Options: DENY`,
   * so browsers refuse to show it inside an iframe. While this is false the
   * modal shows the "open in a new tab" button straight away.
   * Flip to true once the partner allows framing from the landing domain
   * (CSP `frame-ancestors https://<landing-domain>`).
   */
  hostEmbeddable: false,

  /** If the iframe has not loaded after this many ms, show the fallback. */
  iframeTimeoutMs: 6000,
};

/** True when a config value is a real URL (not a TODO placeholder). */
export const isConfigured = (url: string) => /^https?:\/\//.test(url);
