// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // TODO: switch to the custom domain once connected (used for canonical + OG URLs)
  site: "https://tadam-game.netlify.app",
  output: "static",
  integrations: [sitemap({ filter: (page) => !page.includes("/privacy") })],
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
