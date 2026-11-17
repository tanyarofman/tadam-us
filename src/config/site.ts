export const SITE = {
  /** The heytadam Facebook business page. */
  facebookUrl: "https://www.facebook.com/heytadam",
  /** Messenger chat with the page: every "דברו איתנו" button goes here. */
  messengerUrl: "https://m.me/heytadam",
  /** Contact emails (privacy page). Lead-form submissions are emailed to both by Netlify (Forms → notifications). */
  contactEmails: ["tanyarofman@gmail.com", "leibov@gmail.com"],
};

/**
 * Link for the contact buttons: a Messenger chat with the heytadam page.
 * `ref` (e.g. "hero", "cta", "article-<slug>") is passed to the page so it can tell where the chat started.
 */
export const contactLink = (ref?: string) =>
  ref ? `${SITE.messengerUrl}?ref=${encodeURIComponent(ref)}` : SITE.messengerUrl;
