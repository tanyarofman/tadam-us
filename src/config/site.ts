export const SITE = {
  /** Public Eyal game demo. */
  eyalDemoUrl: "https://heytadam.com/eyal-demo",
  /** The heytadam Facebook business page. */
  facebookUrl: "https://www.facebook.com/heytadam",
  /** Messenger chat with the page: every "דברו איתנו" button goes here. */
  messengerUrl: "https://m.me/heytadam",
  /**
   * The public email address. It is a forwarding address (Forward Email, set up with DNS records in Netlify DNS:
   * MX mx1/mx2.forwardemail.net + TXT "forward-email=hey:...") that delivers to Tanya's and Ilan's Gmail.
   * Lead-form submissions are emailed straight to both Gmail addresses (Netlify → Forms → notifications).
   */
  email: "hey@heytadam.com",
};

/**
 * Link for the contact buttons: a Messenger chat with the heytadam page.
 * `ref` (e.g. "hero", "cta", "article-<slug>") is passed to the page so it can tell where the chat started.
 */
export const contactLink = (ref?: string) =>
  ref ? `${SITE.messengerUrl}?ref=${encodeURIComponent(ref)}` : SITE.messengerUrl;
