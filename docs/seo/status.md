# Blog and SEO status (US and Europe site)

Last updated: 2026-11-24 (UK set, wave 2 merged, wave 4 Christmas).

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
- 2026-11-24: DataForSEO questions for wave 3 (virtual team building, family trivia, 50th anniversary, sweet 16 party ideas, trivia questions for work; `data/questions-us-wave3-2026-11-24.csv`, 281 questions): $0.18 (85 calls). Balance $40.03 before, $39.60 after; the other $0.25 of that drop was spent by another session at the same time. Total this round by balance (start about $42.97, now $39.60): $3.37 of the approved $10. The logged lines add up to $3.09, so about $0.28 is not logged yet by the session that spent it.
- 2026-11-24: wave 3, PR 1 (headings approved by Tanya): `team-trivia-for-work` and `virtual-team-building-activities`. The virtual article says honestly that remote play in Tadam isn't confirmed yet. Both have a labeled example scenario waiting for a real story.
- 2026-11-24: 4 year-round rewrites for the US (headings approved by Tanya): `team-building-activities-for-work` (renamed from `team-building-day-ideas`, 301 redirect), `general-knowledge-trivia-questions` (now "trivia questions for adults"), `bachelorette-party-games`, `icebreaker-questions`. Deleted `hanukkah-riddles` and `tu-bishvat-quiz` (301 to /blog/). Wave 1 articles now link to the rewrites.
- 2026-11-24: DataForSEO questions for the 7 wave 2 topics without saved data (`data/questions-us-wave2-2026-11-24.csv`, 451 questions: baby shower games, 30th birthday ideas, 60th birthday party ideas, wedding reception games, couples shower ideas, rehearsal dinner ideas, engagement party ideas): $0.25 (balance $40.31 to $40.06). Total this round: $2.91 of the approved $10. Wave 2 and wave 3 are written in their own sessions; use this file there.
- 2026-11-24: test email to hey@tadamevents.com arrived (Tanya).
- 2026-11-24: DataForSEO questions for 4 wave 4 topics without saved data (`data/questions-us-wave4-2026-11-24.csv`, 202 questions: christmas family games, christmas games for family, thanksgiving family games, friendsgiving games): $0.15. Balance read $39.82 before and $39.35 after; the difference includes other sessions running at the same time. Running total this round: about $3.63 of the approved $10 by the balance ($2.37 before the rewrites, then $40.61 down to $39.35); the $3.82 below adds up the sessions' own estimates, which overlap. Read the balance again before the next round.
- 2026-11-24: wave 4 Christmas articles, written fast for December 2026 at Tanya's request (headings approved): `christmas-trivia-questions` (60 questions, every answer checked; sources in `sources.md`) and `christmas-games-for-family` (25 games). PR 1 of wave 4. Thanksgiving and Friendsgiving follow in PR 2, for next season (live by early October 2027).
- 2026-11-24: Hanukkah rewrites for US families (headings approved by Tanya, PR 1 of the seasonal batch): `hanukkah-games` (now targets dreidel game, 5,400, and hanukkah games, 720) and `hanukkah-trivia` (renamed from `hanukkah-quiz`, 301 redirect; targets hanukkah trivia, 720). No DataForSEO spend: the questions came from `data/questions-us-rewrites-2026-11-24.csv`. New sources: Library of Congress (dreidel history), Sefaria English, Smithsonian (National Menorah), Brandeis (Thanksgivukkah). After merge: Request indexing for both URLs in Search Console. Hanukkah 2026 starts at sundown Fri Dec 4.
- 2026-11-24: seasonal rewrites, PR 2 (headings approved by Tanya): `new-years-eve-games` (renamed from `new-years-eve-at-home`, 301; targets new years eve games 4,400 and new years eve at home ideas 390), `office-christmas-party-games` (renamed from `office-holiday-toast`, 301; targets office christmas party games 2,400 and holiday party ideas for work 720), and `pass-the-parcel-tasks` polished for UK readers (UK spelling, forfeits, the Hebrew name and the Shabbat FAQ removed). No DataForSEO spend. New sources: PLOS ONE (resolutions), Wikipedia (White Elephant), SHRM (inclusive holiday parties). After merge: Request indexing for the three URLs.

- 2026-11-24: DataForSEO questions for 7 wave 2 topics run again by the wave 2 session (it hadn't seen the run above): $0.91 (balance $40.06 to $39.15). Merged with the earlier file, which adds retirement party ideas; `data/questions-us-wave2-2026-11-24.csv` now has 543 questions. Total this round: $3.82 of the approved $10.
- 2026-11-24: wave 2, PR 1 (headings approved by Tanya): `30th-birthday-ideas` and `60th-birthday-party-ideas`, both peaking in January. (The self-serve wording fix this PR also carried was already merged in #17, so it was dropped on rebase.)

- 2026-11-24: wave 2, PR 2 (headings approved by Tanya): `couples-shower-games`, `rehearsal-dinner-ideas`, `wedding-reception-games`. No new DataForSEO spend.

- 2026-11-24: wave 2, PR 3 (headings approved by Tanya): `baby-shower-games`, `engagement-party-games`, `retirement-party-ideas`. No new DataForSEO spend. With PRs #19 and #22, all 8 wave 2 articles are written; see `../history/2026-11-24-wave2.md`.
- 2026-11-24: DataForSEO for the UK set (UK `location_code 2826`, Ireland 2372): questions for "mr and mrs quiz questions", "mr and mrs quiz", "hen party games", "hen do games", "christmas quiz questions" and "christmas quiz"; SERPs for the first three; UK volumes for 37 keywords and Ireland volumes for 22. Files: `data/questions-uk-2026-11-24.csv`, `data/questions-uk-christmas-2026-11-24.csv`, `data/serp-uk-2026-11-24.csv`, `data/volume-uk-set-2026-11-24.csv`, `data/volume-ie-set-2026-11-24.csv`, `data/volume-uk-christmas-2026-11-24.csv`. Spend $0.82 (balance $39.80 to $38.98). Total this round, from the balance: about $3.99 of the approved $10.
- 2026-11-24: UK set, article 1: `christmas-quiz-questions` (UK: christmas quiz 22,200, christmas quiz questions 14,800). Headings approved by Tanya. British spelling (Tanya's decision, now in CLAUDE.md). Deliberately different from the US Christmas trivia article (wave 4): British traditions, no film, music or character rounds. Should be live by early December 2026.

## Next
1. ~~**English only at the root,** plus the site review fixes that need no decision~~ Done in PR #3 (merged 2026-11-24).
2. **Existing articles:**
   - ~~Rewrite trivia, icebreakers, bachelorette and team building~~ Done 2026-11-24.
   - ~~Delete `hanukkah-riddles` and `tu-bishvat-quiz`~~ Done 2026-11-24.
   - ~~Hanukkah games (dreidel) and Hanukkah trivia~~ Done 2026-11-24 (PR 1 of the seasonal batch).
   - ~~Office party, New Year's Eve, pass the parcel (UK)~~ Done 2026-11-24 (seasonal PR 2).
   - 2026-11-24: `bar-mitzvah-attractions` is hidden (`draft: true`, 302 to /blog/). **Tanya decided to hide the bar and bat mitzvah article for now.** Don't rewrite or republish it until she asks.
   - The Tadam sections that still said "send us your stories" or "we build it" (a conflict with the Paddle self-serve wording): 12 articles and one line in `bar-mitzvah-attractions` fixed in PR #17; New Year's Eve, the office party and pass the parcel are fixed in their rewrite PR.
3. **Wave 1 of new articles (January 2027):** all 8 written, in two PRs (1 to 4, then 5 to 8). Seasonal timing: Super Bowl party games should be live by mid-December 2026 to early January 2027 (the game is on Feb 14, 2027); the 40th and 50th birthday articles peak in January.
4. ~~**Wave 2**~~ All 8 merged 2026-11-24 (#19, #22, #27). Next: cross-links between the wave 2 articles, and Request indexing for the 8 new URLs.
5. **UK set:** `christmas-quiz-questions` merged; `mr-and-mrs-quiz-questions` and `hen-party-games` in PR #29, with link swaps in `newlywed-game-questions` and `bachelorette-party-games`.

## Waiting for Tanya
(Settled on 2026-11-24 and removed from this list: the contact route, now "Create yours" to /create and hey@tadamevents.com (PR #13); prices, $99 per game (PR #13); the privacy, terms and refund pages (PR #12); the test email.)
- **Request indexing in Search Console** (URL inspection, then Request indexing). Google allows about 10 a day, and the quota ran out on 2026-11-24, so continue on the next days in this order. Tick each one off here when done. The session "Tadam US: Search Console indexing" keeps this list.
  - **Already requested on 2026-11-24:** the home page, /blog/, `40th-birthday-party-ideas`, `50th-birthday-party-ideas`, `bachelorette-party-games`, `bridal-shower-games`, `bridal-shower-trivia-questions`, `general-knowledge-trivia-questions` (per `docs/history/2026-11-24-parallel-sessions.md`).
  - **Day 1 (seasonal, December first):**
    - [ ] `/blog/hanukkah-games/` (Hanukkah starts Dec 4)
    - [ ] `/blog/hanukkah-trivia/`
    - [ ] `/blog/christmas-trivia-questions/`
    - [ ] `/blog/christmas-games-for-family/`
    - [ ] `/blog/office-christmas-party-games/`
    - [ ] `/blog/new-years-eve-games/`
    - [ ] `/blog/super-bowl-party-games/` (should be indexed by mid-December)
    - [ ] `/blog/30th-birthday-ideas/` (peaks in January)
    - [ ] `/blog/60th-birthday-party-ideas/` (peaks in January)
    - [ ] `/blog/pass-the-parcel-tasks/`
  - **Day 2 (year-round US articles):**
    - [ ] `/blog/how-well-do-you-know-me-questions/`
    - [ ] `/blog/icebreaker-questions/`
    - [ ] `/blog/team-building-activities-for-work/`
    - [ ] `/blog/newlywed-game-questions/`
    - [ ] `/blog/wedding-shoe-game-questions/`
    - [ ] `/blog/baby-shower-games/`
    - [ ] `/blog/engagement-party-games/`
    - [ ] `/blog/retirement-party-ideas/`
    - [ ] `/blog/couples-shower-games/`
    - [ ] `/blog/rehearsal-dinner-ideas/`
  - **Day 3:**
    - [ ] `/blog/wedding-reception-games/`
    - Add new articles here as their PRs merge (wave 3, wave 4 Thanksgiving and Friendsgiving, the UK set).
  - Optional, after the list above: request the 6 already-requested articles again, since their Tadam paragraph changed in PR #17 and PR #24 removed Israel references. Google recrawls on its own, so this can wait.
  - Never request redirected or hidden addresses: `hanukkah-quiz`, `new-years-eve-at-home`, `office-holiday-toast`, `team-building-day-ideas`, `hanukkah-riddles`, `tu-bishvat-quiz`, `bar-mitzvah-attractions` (hidden).
- **The wizard at /create:** /create is a placeholder ("the game creator opens soon") until the English wizard is built on tadamevents.com, in its own session.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **FAQ wording:** whether remote guests can play, and how to compare Tadam with Kahoot or Jackbox. (How far ahead to order is answered since PR #13: the game arrives within 24 hours.)
- **A second demo** (a wedding or a 40th) to match the main US searches. Optional.
- **Real stories** from events, to replace the labeled example scenarios.
- **Demo video:** the home page hero shows "Play GTA VI" as an answer (a real game title). Consider re-recording that question.
- **A weekly article task** for this site, like the Israeli one. Only if Tanya wants it.
