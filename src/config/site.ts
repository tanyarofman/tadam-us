export const SITE = {
  /** Public Eyal game demo (Hebrew): the playable demo on the Hebrew page. */
  eyalDemoUrl: "https://heytadam.com/eyal-demo",
  /** Public Tom birthday game demo (English): the playable demo on the English page (`/en/`). */
  tomDemoUrl: "https://heytadam.com/tom-demo",
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

/** The playable demo game in the page's language. */
export const demoUrl = (locale: "he" | "en") => (locale === "en" ? SITE.tomDemoUrl : SITE.eyalDemoUrl);

/**
 * Recorded demo videos in the page's language: the synced hero clips (big screen + phone, ~19s, no audio)
 * and the full game recording (with sound). Hebrew = Eyal's birthday, English = Tom's 13th birthday
 * (recorded from /tom-demo, question 1 for the hero clips).
 */
export const demoMedia = (locale: "he" | "en") => {
  const s = locale === "en" ? "-en" : "";
  return {
    heroScreen: `/demo/hero-screen${s}${locale === "en" ? "-v2" : ""}.mp4`,
    heroScreenPoster: `/demo/hero-screen${s}-poster.jpg`,
    heroPhone: `/demo/hero-phone${s}${locale === "en" ? "-v2" : ""}.mp4`,
    heroPhonePoster: `/demo/hero-phone${s}-poster.jpg`,
    demo: `/demo/tadam-demo${s}.mp4`,
    demoPoster: `/demo/tadam-demo${s}-poster.webp`,
  };
};

/**
 * Link for the contact buttons: a Messenger chat with the heytadam page.
 * `ref` (e.g. "hero", "cta", "article-<slug>") is passed to the page so it can tell where the chat started.
 */
export const contactLink = (ref?: string) =>
  ref ? `${SITE.messengerUrl}?ref=${encodeURIComponent(ref)}` : SITE.messengerUrl;
