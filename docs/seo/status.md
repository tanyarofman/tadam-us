# Blog and SEO status (US and Europe site)

Last updated: 2026-11-24 (UK set).

This repository started on 2026-11-24 as a copy of the Israeli site. The Israeli blog history and its plans are in `tadam-il` (and in this repository's git history). The older Hebrew research files in `docs/seo/` (`keyword-research-2026-11*.md`, `keywords-il.csv` and the `-il` data files) describe the Israeli market and are kept only for reference.

## Where things are
| What | File |
|---|---|
| Market research and article plan (US, UK, Ireland, Germany) | `keyword-research-us-2026-11.md` |
| Site review (Cite-Me AI search) with fixes and open decisions | `site-review-us-2026-11.md` |
| How to write an article | `content-playbook.md` (rules) and `CLAUDE.md` |
| How to research | `how-to-research.md`, `tools/seo/research.py --market us` |
| Verified sources | `sources.md` |
| Session records (what was decided and why, by date) | `../history/` (start with `2026-11-24-us-site-setup.md`) |

## Done
- 2026-11-24: first research round ($2.37 of the approved $10), the site review, and the article plan.
- 2026-11-24: wave 1, articles 1 to 4 written (PR #4, merged 2026-11-24): `newlywed-game-questions`, `wedding-shoe-game-questions`, `how-well-do-you-know-me-questions`, `bridal-shower-games`. Headings approved by Tanya. Questions came from the saved data (`questions-us-2026-11-24.csv`, `serp-us-2026-11-24.csv`), so no new DataForSEO spend. Each has a labeled example scenario waiting for a real story.
- 2026-11-24: wave 1, articles 5 to 8 written (PR #5, merged 2026-11-24): `bridal-shower-trivia-questions`, `40th-birthday-party-ideas`, `50th-birthday-party-ideas`, `super-bowl-party-games`. Articles 1 and 4 now link to the bridal shower trivia article. No new DataForSEO spend (still $2.37).
- 2026-11-24: domain tadamevents.com live, `noindex` removed, canonical URLs and sitemap on the new domain; hey@tadamevents.com forwards like hey@heytadam.com.
- 2026-11-24: Search Console verified for tadamevents.com (Domain property, DNS TXT record in Netlify DNS) and both sitemaps read successfully (22 pages). Bing Webmaster Tools added by import from Search Console; sitemap submitted.
- 2026-11-24: DataForSEO questions for the 8 rewrite topics (`data/questions-us-rewrites-2026-11-24.csv`, 507 questions): $0.29 (balance $40.61 to $40.31). Total this round: $2.66 of the approved $10.
- 2026-11-24: 4 year-round rewrites for the US (headings approved by Tanya): `team-building-activities-for-work` (renamed from `team-building-day-ideas`, 301 redirect), `general-knowledge-trivia-questions` (now "trivia questions for adults"), `bachelorette-party-games`, `icebreaker-questions`. Deleted `hanukkah-riddles` and `tu-bishvat-quiz` (301 to /blog/). Wave 1 articles now link to the rewrites.
- 2026-11-24: DataForSEO questions for the 7 wave 2 topics without saved data (`data/questions-us-wave2-2026-11-24.csv`, 451 questions: baby shower games, 30th birthday ideas, 60th birthday party ideas, wedding reception games, couples shower ideas, rehearsal dinner ideas, engagement party ideas): $0.25 (balance $40.31 to $40.06). Total this round: $2.91 of the approved $10. Wave 2 and wave 3 are written in their own sessions; use this file there.
- 2026-11-24: test email to hey@tadamevents.com arrived (Tanya).
- 2026-11-24: DataForSEO for the UK set (UK `location_code 2826`, Ireland 2372): questions for "mr and mrs quiz questions", "mr and mrs quiz", "hen party games", "hen do games", "christmas quiz questions" and "christmas quiz"; SERPs for the first three; UK volumes for 37 keywords and Ireland volumes for 22. Files: `data/questions-uk-2026-11-24.csv`, `data/questions-uk-christmas-2026-11-24.csv`, `data/serp-uk-2026-11-24.csv`, `data/volume-uk-set-2026-11-24.csv`, `data/volume-ie-set-2026-11-24.csv`, `data/volume-uk-christmas-2026-11-24.csv`. Spend $0.82 (balance $39.80 to $38.98). Total this round, from the balance: about $3.99 of the approved $10.
- 2026-11-24: UK set, article 1: `christmas-quiz-questions` (UK: christmas quiz 22,200, christmas quiz questions 14,800). Headings approved by Tanya. British spelling (Tanya's decision, now in CLAUDE.md). Deliberately different from the US Christmas trivia article (wave 4): British traditions, no film, music or character rounds. Should be live by early December 2026.

## Next
1. ~~**English only at the root,** plus the site review fixes that need no decision~~ Done in PR #3 (merged 2026-11-24).
2. **Existing articles:**
   - ~~Rewrite trivia, icebreakers, bachelorette and team building~~ Done 2026-11-24.
   - ~~Delete `hanukkah-riddles` and `tu-bishvat-quiz`~~ Done 2026-11-24.
   - Still to rewrite: office party (as office Christmas party games), New Year's Eve, hanukkah games (dreidel), hanukkah trivia, bar and bat mitzvah. The seasonal ones can wait for next season (October and November 2027); the questions for them are already in `data/questions-us-rewrites-2026-11-24.csv`.
   - Keep `pass-the-parcel-tasks` as a UK article.
3. **Wave 1 of new articles (January 2027):** all 8 written, in two PRs (1 to 4, then 5 to 8). Seasonal timing: Super Bowl party games should be live by mid-December 2026 to early January 2027 (the game is on Feb 14, 2027); the 40th and 50th birthday articles peak in January.
4. **UK set:** `christmas-quiz-questions` done; `mr-and-mrs-quiz-questions` and `hen-party-games` next (headings approved 2026-11-24), with link swaps in `newlywed-game-questions` and `bachelorette-party-games`.
5. **Wave 2** (couples shower, engagement party, rehearsal dinner, reception games, baby shower, 30th, 60th, retirement): show Tanya the headings before drafting.

## Waiting for Tanya
(Settled on 2026-11-24 and removed from this list: the contact route, now "Create yours" to /create and hey@tadamevents.com (PR #13); prices, $99 per game (PR #13); the privacy, terms and refund pages (PR #12); the test email.)
- **The wizard at /create:** /create is a placeholder ("the game creator opens soon") until the English wizard is built on tadamevents.com, in its own session.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **FAQ wording:** whether remote guests can play, and how to compare Tadam with Kahoot or Jackbox. (How far ahead to order is answered since PR #13: the game arrives within 24 hours.)
- **A second demo** (a wedding or a 40th) to match the main US searches. Optional.
- **Real stories** from events, to replace the labeled example scenarios.
- **Demo video:** the home page hero shows "Play GTA VI" as an answer (a real game title). Consider re-recording that question.
- **A weekly article task** for this site, like the Israeli one. Only if Tanya wants it.
