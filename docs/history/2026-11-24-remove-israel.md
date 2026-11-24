# 2026-11-24: No connection to Israel on the US site

**Decision (Tanya):** the US site must have no connection to Israel.

## What changed
- Legal pages and footer: removed the street address, "registered in Israel" and "Osek Murshe", the Israeli governing-law clause (Tel Aviv courts), and the Israel mentions in the international transfers and retention sections. The footer now reads "© <year> Tanya Rofman. Payments processed by Paddle.com." The legal name stays (Paddle checks it).
- Terms, section 12: now only says consumers keep their local mandatory law and courts. There is no governing-law choice any more.
- Blog: The Hanukkah, New Year's Eve, office party and pass the parcel articles were rewritten for the US in PRs #15 and #21 at the same time; this PR removed the two Israel mentions left in the Hanukkah ones. `bar-mitzvah-attractions` is hidden as a draft with a 302 to /blog/. Tanya decided to keep it hidden for now: no rewrite until she asks.
- `site.webmanifest`: Hebrew name and RTL replaced with "Tadam!", English, LTR. Leaderboard numbers format as en-US instead of he-IL.

## Open
- A lawyer may want a governing-law clause back. Any jurisdiction named must be the real one, so this is Tanya's call.
- Paddle's review: check that a site without a country or address still passes (the legal name matches the account). The drafts in `docs/paddle/` still describe the old footer line.
