// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // TODO: switch to the custom domain once connected (used for canonical + OG URLs)
  site: "https://tadam-game.netlify.app",
  output: "static",
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
