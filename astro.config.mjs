// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  // TODO: set the real production domain before launch (used for canonical + OG URLs)
  site: "https://tadam.co.il",
  output: "static",
  build: { inlineStylesheets: "always" },
  devToolbar: { enabled: false },
});
