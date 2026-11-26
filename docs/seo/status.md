# Blog and SEO status (US and Europe site)

Last updated: 2026-11-26 (pricing and customer testimonials).

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
| Paddle review checklist (website and account) | `../paddle/paddle-checklist.md` |

## Homepage updates, November 25 and 26, 2026

PR #54 was merged and published on November 25: Basic/VIP packages, custom hosts,
revised copy, demo cards, testimonials, navigation and scroll effects. Ilan approved
PR #61 for production on November 26: Basic $99 / VIP $149, and his supplied
customer quotes and portraits for Elizabeth W., Noah H. and Susan O. The customer
testimonials replace the fictional samples and include the supplied 5/5 ratings,
review dates and publication permission. Game review schema describes the actual
Tadam trivia game and matches the visible cards and 5/5 average across these three
reviews. Game is supported for Google review snippets; display is not guaranteed. Details:
`../history/2026-11-26-pricing-and-testimonials.md`. The historical live-site checks
below predate these updates; `/create` remains the existing coming-soon page.

## Paddle review status (checked on the live site, 2026-11-24)
- **Not submitted to Paddle yet.** There is no record of a sandbox or live account, or of a domain submission.
- **Website requirements 1 to 11 pass:** product description, $99 price, `/terms` (Paddle as merchant of record), `/privacy`, `/refunds` (14 days), the legal name in the footer and on the legal pages with no country or address, email contact only, self-serve wording in the site and the blog, invented hosts.
- **Blocking the review:**
  1. `/create` (every "Create yours" button) is a "Coming soon" page with no checkout yet (checklist requirement 12).
  2. The legal pages still need a lawyer's review.
- **Then:** open the live Paddle account and submit `tadamevents.com` for website approval (requirement 13). Details in `../paddle/paddle-checklist.md` and `../history/2026-11-24-remove-israel.md`.

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
- 2026-11-24: wave 3, PR 3 (headings approved by Tanya): `family-reunion-games` and `family-trivia-questions`. Merged 2026-11-24 at Tanya's request (the plan was early June 2027; family reunion searches peak in July). Tadam sections use the self-serve wording from PR #17. Each has a labeled example scenario waiting for a real story.
- 2026-11-24: wave 3, PR 2 (headings approved by Tanya): `graduation-party-games`, `50th-anniversary-party-ideas`, `sweet-16-party-ideas`. Merged 2026-11-24 at Tanya's request (the plan was March 2027; sweet 16 peaks in March, graduation and the 50th anniversary in May). Each has a labeled example scenario waiting for a real story.
- 2026-11-24: test email to hey@tadamevents.com arrived (Tanya).
- 2026-11-24: wave 4, PR 2 (headings approved by Tanya): `thanksgiving-family-games` (25 games, 12 checked trivia questions) and `friendsgiving-games` (20 games). For next season: merge any time, but they matter from early October 2027. Questions from `data/questions-us-wave4-2026-11-24.csv` (no new spend in this PR). Cross-links: Thanksgiving links to Christmas games for family, Friendsgiving to office Christmas party games, and Christmas games for family to New Year's Eve games. `office-christmas-party-games` and `new-years-eve-games` already have 5 internal links, so they don't link to Christmas trivia yet.
- 2026-11-24: `christmas-trivia-questions` (US) and `christmas-quiz-questions` (UK) link to each other, replacing each one's link to the general trivia article (both stay at 5 internal links).
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
- 2026-11-24: UK set, articles 2 and 3: `mr-and-mrs-quiz-questions` (UK 6,600, Ireland 590) and `hen-party-games` (hen party games and hen do games, UK 9,900 each). Headings approved by Tanya, British spelling. Questions from the UK research (`data/questions-uk-2026-11-24.csv`, logged with the Christmas quiz PR). Link swaps approved by Tanya: `newlywed-game-questions` now links to the Mr and Mrs article (instead of how-well-do-you-know-me), and `bachelorette-party-games` links to hen party games (instead of bridal-shower-games).
- 2026-11-25: **Google Analytics 4** (PR #53, merged on Tanya's request; preview checked in GA4 Realtime): GA account "Tadam", property tadamevents.com, Measurement ID `G-RNQE8BY438` (`src/config/site.ts`). Consent Mode v2, option A: a cookie banner for Europe only, ads off everywhere, "Cookie settings" in the footer. Site events (create, demo, contact clicks, FAQ, Coming soon signup) go to GA4. Privacy policy section 9 and its draft updated. See `../history/2026-11-25-google-analytics.md`.
- 2026-11-25: **Indexing, all pages at once.** Google's Request indexing quota (about 10 a day) was used up again, and URL inspection showed "No referring sitemaps detected": Search Console had last read the sitemap on 2026-11-24, when it listed 22 pages (the live sitemap now has 43). Tanya resubmitted `sitemap-index.xml` in Search Console (submitted 2026-11-25; check that "Discovered pages" goes up to 43). In Bing Webmaster Tools she submitted all 43 sitemap addresses in URL Submission (quota 100 a day, "43 URLs submitted successfully") and added `sitemap-0.xml` directly, because Bing had found only 1 address through the sitemap index.
- 2026-11-25: **IndexNow** (PR "IndexNow"): after every production deploy, the Netlify function `netlify/functions/deploy-succeeded.mjs` tells Bing (and the other IndexNow engines) which pages are new, changed or removed, so new articles don't need manual submission in Bing. Key file `public/4133d0b66cd2c52cdac1f70b5cc52e5c.txt` (public by design). The page fingerprints of the last deploy are kept in Netlify Blobs (store `indexnow`); the first production deploy sends all 43 pages. Logs: Netlify, Logs, Functions, `deploy-succeeded`. Google doesn't use IndexNow: for Google, the sitemap and Request indexing still apply.

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
4. ~~**Wave 2**~~ All 8 merged 2026-11-24 (#19, #22, #27). Cross-links added (#35). Next: Request indexing for the 8 new URLs.
5. ~~**UK set**~~ All 3 merged 2026-11-24: `christmas-quiz-questions` (#26), `mr-and-mrs-quiz-questions` and `hen-party-games` (#29), with link swaps in `newlywed-game-questions` and `bachelorette-party-games`. Next: Request indexing for the 3 URLs, and real stories to replace the example scenarios.

## Waiting for Tanya
(Settled on 2026-11-24 and removed from this list: the contact route, now "Create yours" to /create and hey@tadamevents.com (PR #13); prices, $99 per game (PR #13); the privacy, terms and refund pages (PR #12); the test email.)
- **Google Analytics:** check GA4 Realtime on the live site, mark key events (`launch_list_submit`, `cta_create_click`), and confirm in GA4 Admin: data retention 14 months, Search Console linked, Ilan added. Details in `../history/2026-11-25-google-analytics.md`.
- **Paddle review:** the wizard and checkout at `/create`, and a lawyer's review of `/terms` and `/privacy`, before the live account and the website submission. See "Paddle review status" above.
- **Request indexing in Search Console** (URL inspection, then Request indexing). Google allows about 10 a day, and the quota ran out on 2026-11-24 and again on 2026-11-25, so continue on the next days in this order. Since the sitemap was resubmitted on 2026-11-25, Google also finds these pages on its own; the requests only move them up the line. Bing has all 43 already (2026-11-25), so this list is for Google only. Tick each one off here when done. The session "Tadam US: Search Console indexing" keeps this list.
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
    - [ ] `/blog/christmas-quiz-questions/` (UK set, #26; seasonal, can move up)
    - [ ] `/blog/team-trivia-for-work/` (wave 3, #20)
    - [ ] `/blog/virtual-team-building-activities/` (wave 3, #20)
    - [ ] `/blog/mr-and-mrs-quiz-questions/` (UK set, #29)
    - [ ] `/blog/hen-party-games/` (UK set, #29)
  - **Day 4:**
    - [ ] `/blog/graduation-party-games/` (wave 3, #25, live 2026-11-24 at Tanya's request, earlier than the March plan)
    - [ ] `/blog/50th-anniversary-party-ideas/` (wave 3, #25)
    - [ ] `/blog/sweet-16-party-ideas/` (wave 3, #25)
    - [ ] `/blog/family-reunion-games/` (wave 3, #31)
    - [ ] `/blog/family-trivia-questions/` (wave 3, #31)
    - [ ] `/blog/thanksgiving-family-games/` (wave 4, #28; for next season, so last)
    - [ ] `/blog/friendsgiving-games/` (wave 4, #28; for next season, so last)
    - Add new articles here as their PRs merge.
  - Never request deploy-preview addresses (`deploy-preview-<n>--tadam-us.netlify.app`): they are outside the Search Console property and Netlify serves them with `noindex`.
  - Optional, after the list above: request the 6 already-requested articles again, since their Tadam paragraph changed in PR #17 and PR #24 removed Israel references. Google recrawls on its own, so this can wait.
  - Never request redirected or hidden addresses: `hanukkah-quiz`, `new-years-eve-at-home`, `office-holiday-toast`, `team-building-day-ideas`, `hanukkah-riddles`, `tu-bishvat-quiz`, `bar-mitzvah-attractions` (hidden).
- **The wizard at /create:** built on 2026-11-26 (branch `feat/create-wizard`, see `../history/2026-11-26-create-wizard.md`): English wizard ported from the tadam-il draft, Basic or VIP on the order card, orders in Netlify Blobs, Paddle checkout with automatic order matching. Waiting for Tanya: review on the deploy preview, Paddle sandbox keys, and the final events, hosts and questions.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **FAQ wording:** whether remote guests can play, and how to compare Tadam with Kahoot or Jackbox. (How far ahead to order is answered since PR #13: the game arrives within 24 hours.)
- **A second demo** (a wedding or a 40th) to match the main US searches. Optional.
- **Real stories** from events, to replace the labeled example scenarios.
- **Demo video:** the home page hero shows "Play GTA VI" as an answer (a real game title). Consider re-recording that question.
- **A weekly article task** for this site, like the Israeli one. Only if Tanya wants it.
