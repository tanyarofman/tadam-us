# Blog and SEO status (US and Europe site)

Last updated: 2026-11-24.

This repository started on 2026-11-24 as a copy of the Israeli site. The Israeli blog history and its plans are in `tadam-il` (and in this repository's git history). The older Hebrew research files in `docs/seo/` (`keyword-research-2026-11*.md`, `keywords-il.csv` and the `-il` data files) describe the Israeli market and are kept only for reference.

## Where things are
| What | File |
|---|---|
| Market research and article plan (US, UK, Ireland, Germany) | `keyword-research-us-2026-11.md` |
| Site review (Cite-Me AI search) with fixes and open decisions | `site-review-us-2026-11.md` |
| How to write an article | `content-playbook.md` (rules) and `CLAUDE.md` |
| How to research | `how-to-research.md`, `tools/seo/research.py --market us` |
| Verified sources | `sources.md` |

## Done
- 2026-11-24: first research round ($2.37 of the approved $10), the site review, and the article plan.
- 2026-11-24: wave 1, articles 1 to 4 written (PR #4, not merged): `newlywed-game-questions`, `wedding-shoe-game-questions`, `how-well-do-you-know-me-questions`, `bridal-shower-games`. Headings approved by Tanya. Questions came from the saved data (`questions-us-2026-11-24.csv`, `serp-us-2026-11-24.csv`), so no new DataForSEO spend. Each has a labeled example scenario waiting for a real story.
- 2026-11-24: wave 1, articles 5 to 8 written (PR #5, not merged): `bridal-shower-trivia-questions`, `40th-birthday-party-ideas`, `50th-birthday-party-ideas`, `super-bowl-party-games`. Articles 1 and 4 now link to the bridal shower trivia article. No new DataForSEO spend (still $2.37).
- 2026-11-24: domain tadamevents.com live, `noindex` removed, canonical URLs and sitemap on the new domain; hey@tadamevents.com forwards like hey@heytadam.com.

## Next
1. ~~**English only at the root,** plus the site review fixes that need no decision~~ Done in PR #3 (merged 2026-11-24).
2. **Existing articles:**
   - Rewrite 6 for the US: trivia questions, icebreakers, bachelorette games, team building, office party, New Year's Eve.
   - Rewrite 3 for US families: hanukkah games (dreidel), hanukkah trivia, bar and bat mitzvah.
   - Keep `pass-the-parcel-tasks` as a UK article.
   - Delete `hanukkah-riddles` and `tu-bishvat-quiz`.
3. **Wave 1 of new articles (January 2027):** all 8 written, in two PRs (1 to 4, then 5 to 8). Seasonal timing: Super Bowl party games should be live by mid-December 2026 to early January 2027 (the game is on Feb 14, 2027); the 40th and 50th birthday articles peak in January.
4. **Wave 2** (couples shower, engagement party, rehearsal dinner, reception games, baby shower, 30th, 60th, retirement): show Tanya the headings before drafting.

## Waiting for Tanya
- **Search Console:** add and verify tadamevents.com (a DNS TXT record in Netlify DNS works), then submit `https://tadamevents.com/sitemap-index.xml`. Also Bing Webmaster Tools. Needs Tanya's Google account.
- **Contact route for the US:** an email address on the new domain, a separate social page, or the form only.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **Prices** in USD/EUR, or keep them hidden.
- **Privacy policy** for the US and the EU. Claude can draft it; a legal check is advised.
- **FAQ wording:** how to compare Tadam with Kahoot or Jackbox, whether remote guests can play, and how far ahead to order.
- **A second demo** (a wedding or a 40th) to match the main US searches. Optional.
- **Real stories** from events, to replace the labeled example scenarios.
- **A weekly article task** for this site, like the Israeli one. Only if Tanya wants it.
