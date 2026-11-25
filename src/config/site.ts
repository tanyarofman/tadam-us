export const SITE = {
  /** The public playable demo: Tom's birthday game. `/tom-demo` is proxied to Base44 in netlify.toml. */
  tomDemoUrl: "/tom-demo",
  /**
   * The public email address and the only contact route on the site (no social accounts for the US yet).
   * It is a forwarding address (Forward Email, set up with DNS records in the tadamevents.com Netlify DNS zone:
   * MX mx1/mx2.forwardemail.net + TXT "forward-email=hey:..." + SPF) that delivers to Tanya's and Ilan's Gmail.
   */
  email: "hey@tadamevents.com",
  /**
   * Google Analytics 4: property "tadamevents.com" in the GA account "Tadam" (Tanya's Google account), web stream
   * https://tadamevents.com. Not a secret. Loaded by src/components/Analytics.astro with Consent Mode (see that file).
   */
  ga4MeasurementId: "G-RNQE8BY438",
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

/** mailto: link for the contact links (footer, blog articles, legal pages). */
export const emailLink = () => `mailto:${SITE.email}`;
