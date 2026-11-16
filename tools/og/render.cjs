// Renders tools/og/og.html to public/brand/og-image.png (1200x630)
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.resolve(__dirname, "og.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.resolve(__dirname, "../../public/brand/og-image.png") });
  await b.close();
})();
