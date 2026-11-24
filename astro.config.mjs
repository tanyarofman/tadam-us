// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // The site address (canonical + OG URLs, sitemap, llms.txt). Also named in public/robots.txt.
  site: "https://tadamevents.com",
  output: "static",
  integrations: [sitemap({ filter: (page) => !page.includes("/privacy") && !page.includes("/drafts") && !page.includes("/create") })],
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
