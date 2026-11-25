// IndexNow: tells Bing (and the other IndexNow engines; Bing feeds ChatGPT search and Copilot)
// which pages changed, right after a production deploy. Google doesn't use IndexNow; it reads
// the sitemap. Used by netlify/functions/deploy-succeeded.mjs.

export const SITE = "https://tadamevents.com";
// The key is public by design: Bing checks that https://tadamevents.com/<key>.txt contains it.
export const KEY = "4133d0b66cd2c52cdac1f70b5cc52e5c";
const ENDPOINT = "https://api.indexnow.org/indexnow";

/** Every page address in the live sitemap (sitemap-index.xml, then each sitemap it lists). */
export async function sitemapUrls(fetchFn = fetch) {
  const locs = async (url) => {
    const res = await fetchFn(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    const xml = await res.text();
    return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  };
  const sitemaps = await locs(`${SITE}/sitemap-index.xml`);
  const pages = (await Promise.all(sitemaps.map(locs))).flat();
  return [...new Set(pages)].filter((u) => u.startsWith(`${SITE}/`));
}

/** A short fingerprint of each page's HTML, so only pages that really changed are sent. */
export async function fingerprints(urls, fetchFn = fetch) {
  const entries = await Promise.all(
    urls.map(async (url) => {
      const res = await fetchFn(url, { headers: { "cache-control": "no-cache" } });
      if (!res.ok) return [url, `http-${res.status}`];
      const bytes = new TextEncoder().encode(await res.text());
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return [url, Buffer.from(digest).toString("hex")];
    }),
  );
  return Object.fromEntries(entries);
}

/** Pages that are new, changed or removed since the last deploy. */
export function changedUrls(previous, current) {
  const changed = Object.keys(current).filter((u) => previous[u] !== current[u]);
  const removed = Object.keys(previous).filter((u) => !(u in current));
  return [...changed, ...removed];
}

/** Sends the addresses to IndexNow. 200 and 202 both mean accepted. */
export async function submit(urlList, fetchFn = fetch) {
  const res = await fetchFn(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  return res.status;
}
