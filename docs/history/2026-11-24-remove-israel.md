# 2026-11-24: No connection to Israel on the US site

**Decision (Tanya):** the US site must have no connection to Israel. It started when Tanya saw the street address on the privacy page. The rule is now in `CLAUDE.md` (Rules for the site).

## What was decided
- **No Israel anywhere public:** no country, street address, business type (Osek Murshe) or business number on the legal pages or the footer, no Israeli law or courts, no Hebrew words used as Israeli terms, no .il links, no Israeli examples. Contact is email only.
- **The legal name stays:** "Tanya Rofman" remains on the legal pages and in the footer, because Paddle checks that the site and the account show the same legal name.
- **The private Paddle docs keep the real details:** `docs/paddle/paddle-signup-guide.md` and `paddle-application.md` still hold the business number and address, because Paddle needs them for the account. They're never published.
- **Bar and bat mitzvah:** Tanya decided to hide `bar-mitzvah-attractions` for now. Don't rewrite or republish it until she asks.
- **Hebrew in Jewish holiday content is fine:** the dreidel's Hebrew letters, "Hebrew school" and the Temple in Jerusalem are part of Hanukkah, not a link to Israel, so they stay in the Hanukkah articles.

## What changed (all merged and live)
- **PR #24, the site:**
  - Legal pages and footer: removed the address, "registered in Israel", "Osek Murshe", the Israeli governing-law clause (Tel Aviv courts), and Israel in the international transfers and retention sections. The footer reads "© <year> Tanya Rofman. Payments processed by Paddle.com."
  - Terms, section 12: only says consumers keep their local mandatory law and courts. There is no governing-law choice any more.
  - Blog: other sessions rewrote the Hanukkah, New Year's Eve, office party and pass the parcel articles for the US at the same time (PRs #15 and #21); this PR removed the two Israel mentions left in the Hanukkah ones. `bar-mitzvah-attractions` is a draft with a 302 to /blog/.
  - `site.webmanifest`: "Tadam!", English, LTR (was the Hebrew name, RTL). Leaderboard numbers format as en-US instead of he-IL.
  - Checked after the deploy: the live home page, legal pages, blog index, every blog article in the sitemap, `/llms.txt` and the manifest have no Israel, Tel Aviv, address, shekel or .il link.
- **PR #32, notes:** `docs/seo/status.md` and `netlify.toml` say the bar mitzvah article is hidden by Tanya's decision, not waiting for a rewrite.
- **PR #33, Paddle docs:** `site-copy.md` and `HANDOFF.md` have the new footer line; the `terms.md` and `privacy-policy.md` drafts match the live pages (no Israel), each with a note at the top.

## Open
- **Governing law:** a lawyer may want a governing-law clause back. Any jurisdiction named must be the real one, so it's Tanya's call.
- **Paddle review:** check that the site passes without a country or address. The legal name matches the account, so it should.
