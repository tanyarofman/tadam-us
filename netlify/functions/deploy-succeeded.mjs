// Netlify runs this automatically after every successful deploy (an event-triggered function).
// On production deploys only, it tells Bing via IndexNow which pages are new, changed or removed.
// The fingerprints from the previous deploy are kept in Netlify Blobs (store "indexnow").
// Logs: Netlify > tadam-us > Logs > Functions > deploy-succeeded.
import { connectLambda, getStore } from "@netlify/blobs";
import { changedUrls, fingerprints, sitemapUrls, submit } from "../lib/indexnow.mjs";

export async function handler(event) {
  const { payload } = JSON.parse(event.body || "{}");
  if (payload?.context !== "production") {
    console.log(`IndexNow: skipped (${payload?.context ?? "unknown"} deploy)`);
    return { statusCode: 200 };
  }

  try {
    connectLambda(event);
    const store = getStore("indexnow");
    const previous = (await store.get("fingerprints", { type: "json" })) ?? {};
    const current = await fingerprints(await sitemapUrls());
    const urls = changedUrls(previous, current);

    if (urls.length === 0) {
      console.log("IndexNow: no pages changed");
      return { statusCode: 200 };
    }
    const status = await submit(urls);
    console.log(`IndexNow: sent ${urls.length} addresses, HTTP ${status}`, urls);
    // Only remember this deploy once IndexNow accepted it, so a failure is retried next deploy.
    if (status === 200 || status === 202) await store.setJSON("fingerprints", current);
  } catch (err) {
    // Never fail loudly: IndexNow is a nice-to-have and must not affect the site.
    console.error("IndexNow: failed", err);
  }
  return { statusCode: 200 };
}
