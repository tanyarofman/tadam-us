export const SITE = {
  /** The public playable demo: Tom's birthday game. `/tom-demo` is proxied to Base44 in netlify.toml. */
  tomDemoUrl: "/tom-demo",
  /** The heytadam Facebook business page. */
  /** TODO (Tanya): the US contact route. These are still the Israeli heytadam Facebook page and Messenger. */
  facebookUrl: "https://www.facebook.com/heytadam",
  /** Messenger chat with the page: every "Talk to us" button goes here. */
  messengerUrl: "https://m.me/heytadam",
  /**
   * The public email address. It is a forwarding address (Forward Email, set up with DNS records in Netlify DNS:
   * MX mx1/mx2.forwardemail.net + TXT "forward-email=hey:...") that delivers to Tanya's and Ilan's Gmail.
   * Lead-form submissions are emailed straight to both Gmail addresses (Netlify → Forms → notifications).
   */
  email: "hey@heytadam.com",
};

/** The playable demo game. */
export const demoUrl = (_locale: "en" = "en") => SITE.tomDemoUrl;

/**
 * Recorded demo videos: the synced hero clips (big screen + phone, ~19s, no audio) and the full game
 * recording (with sound), all from Tom's 13th birthday (recorded from /tom-demo, question 1 for the hero clips).
 */
export const demoMedia = (_locale: "en" = "en") => ({
  heroScreen: "/demo/hero-screen-en-v2.mp4",
  heroScreenPoster: "/demo/hero-screen-en-poster.jpg",
  heroPhone: "/demo/hero-phone-en-v2.mp4",
  heroPhonePoster: "/demo/hero-phone-en-poster.jpg",
  demo: "/demo/tadam-demo-en.mp4",
  demoPoster: "/demo/tadam-demo-en-poster.webp",
});

/**
 * Link for the contact buttons: a Messenger chat with the heytadam page.
 * `ref` (e.g. "hero", "cta", "article-<slug>") is passed to the page so it can tell where the chat started.
 */
export const contactLink = (ref?: string) =>
  ref ? `${SITE.messengerUrl}?ref=${encodeURIComponent(ref)}` : SITE.messengerUrl;
