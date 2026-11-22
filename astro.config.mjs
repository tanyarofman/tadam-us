// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // The custom domain (canonical + OG URLs, sitemap, llms.txt). Also update public/robots.txt if it changes.
  site: "https://heytadam.com",
  output: "static",
  integrations: [sitemap({ filter: (page) => !page.includes("/privacy") && !page.includes("/drafts") && !page.includes("/start") })],
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
