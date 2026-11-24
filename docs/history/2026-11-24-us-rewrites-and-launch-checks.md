# 2026-11-24: Search Console, the first US rewrites, and "Create yours"

Session record. It follows `2026-11-24-handoff.md` and ran locally on Tanya's computer.

## Launch checks
- **Search Console:** tadamevents.com was added as a Domain property and verified. The TXT record `google-site-verification=…` was added to the tadamevents.com zone in Netlify DNS through the API. The first try failed because Verify was clicked before the record existed.
- **Sitemaps:** a domain property needs the full URL in the sitemap box. Both `https://tadamevents.com/sitemap-index.xml` and `https://tadamevents.com/sitemap-0.xml` were submitted and show Success, with 22 pages.
- **Bing Webmaster Tools:** imported from Search Console into Tanya's existing Bing account (the one with velonova.io). The sitemap was submitted.
- **Email:** a test to hey@tadamevents.com arrived (Tanya).
- **Local setup:** works on Tanya's Mac. DataForSEO credentials are in `~/.config/dataforseo/env`, Netlify goes through the `netlify` CLI, and GitHub through `gh`. Playwright was installed with `--no-save` for the 390px check. `check_mobile.mjs` has port 4329 hard-coded; `.claude/launch.json` serves the preview on 4322.

## Blog: which rewrites first, and why
- Tanya first got the Hanukkah pair recommended because of the date (Hanukkah starts Dec 4). When she asked why, the recommendation changed: a brand-new domain rarely ranks within 10 days. The 4 year-round articles have about 31,000 US searches a month between them, against about 6,800 for the Hanukkah pair, so they went first.
- **PR #14 (merged):**
  - `team-building-activities-for-work` (renamed from `team-building-day-ideas`, with a 301 redirect)
  - `general-knowledge-trivia-questions` (now "100 Trivia Questions for Adults")
  - `bachelorette-party-games`
  - `icebreaker-questions`

  The PR also deleted `hanukkah-riddles` and `tu-bishvat-quiz` (both redirect to /blog/), and wave 1 articles now link to the rewrites. Headings were approved by Tanya first.
- **Removed on purpose:**
  - Israeli pay and tax law
  - the Israel, Hebrew and Tanakh trivia sections
  - pop culture trivia, since it means celebrities
  - sports team names
  - a celebrity pun in the team-name FAQ
  - two shaky animal facts
- **New sources:** 29 CFR 785.27 (Cornell LII), Klein et al. 2009 (team building meta-analysis), and The Knot on who hosts the bachelorette.
- **DataForSEO:** $0.29 for the rewrite questions and $0.25 for wave 2 questions. Total this round: $2.91 of $10.

## Site: "Create yours" instead of Messenger
- Tanya asked to remove every Messenger CTA in favor of "Create yours" that opens the wizard. Another session had already built this in PR #13.
- At Tanya's request, PRs #11 (Paddle docs), #12 (terms, privacy, refunds) and #13 ($99 pricing, "Create yours", no Messenger) were merged in that order.
- #13 conflicted with #14 on the old team building article; the rewrite was kept.
- **Production result:**
  - no Messenger, m.me or Facebook links on the site
  - 6 "Create yours" buttons on the home page
  - `/create`, `/terms`, `/privacy` and `/refunds/` answer 200
- **The wizard is not on the site yet.** `/create` is a placeholder. Tanya decided Base44 is not part of the user-facing flow. The English wizard is to be built on tadamevents.com from the Hebrew one (audited in `tadam-il/docs/onboarding-flow.md`), in a new session.

## Work moved to other sessions
- Wave 2 and wave 3 articles (use `docs/seo/data/questions-us-wave2-2026-11-24.csv` for wave 2).
- The 5 seasonal rewrites: office party, New Year's Eve, Hanukkah games, Hanukkah trivia, bar and bat mitzvah.
- Indexing requests in Search Console.
- The English wizard.

## Open (Tanya)
See "Waiting for Tanya" in `docs/seo/status.md`:
- About facts
- remote guests and the Kahoot/Jackbox FAQ line
- real stories
- the "Play GTA VI" demo answer
- a second demo
- a weekly article task
