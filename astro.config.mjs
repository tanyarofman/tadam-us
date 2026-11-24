// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // The site address (canonical + OG URLs, sitemap, llms.txt). The netlify.app address until the US domain is bought;
  // then change it here and in public/robots.txt, and remove the noindex header in netlify.toml.
  site: "https://tadam-us.netlify.app",
  output: "static",
  integrations: [sitemap({ filter: (page) => !page.includes("/privacy") && !page.includes("/drafts") })],
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
