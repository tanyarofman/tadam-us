// Check blog pages at a 390px phone width: no horizontal overflow, tables fit, 4 FAQ items.
// Usage: npm run build && npx astro preview --port 4329 &  then  node tools/seo/check_mobile.mjs <slug> [<slug> ...]
// Uses the preinstalled Playwright (cloud) or a local install (npm i -D playwright; npx playwright install chromium).
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  let bad = 0;
  for (const s of process.argv.slice(2)) {
    const r = await p.goto(`http://localhost:4329/blog/${s}/`, { waitUntil: 'networkidle' });
    const m = await p.evaluate(() => {
      const doc = document.documentElement;
      const tables = [...document.querySelectorAll('.prose table')].map(t => {
        return { tw: t.scrollWidth, cw: t.clientWidth };
      });
      return { sw: doc.scrollWidth, cw: doc.clientWidth, tables, h1: document.querySelector('h1')?.textContent.trim(), faq: document.querySelectorAll('.article-faq details').length };
    });
    const overflow = m.sw > m.cw;
    console.log(s, r.status(), 'page', m.sw, '/', m.cw, overflow ? 'OVERFLOW' : 'ok', 'tables', JSON.stringify(m.tables), 'faq', m.faq);
    if (overflow || r.status() !== 200 || m.tables.some(t => t.tw > t.cw)) bad++;
  }
  await b.close(); process.exit(bad ? 1 : 0);
})();
