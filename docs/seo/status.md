# Blog status and to-dos

Last updated: 2026-11-22. 12 articles are live on https://heytadam.com/blog/. The first four went live on 2026-11-16 ([tanyarofman/tadam#30](https://github.com/tanyarofman/tadam/pull/30)); eight more were merged on 2026-11-22 ([tanyarofman/tadam#57](https://github.com/tanyarofman/tadam/pull/57)). New articles go on a branch with their own pull request; merge only when Tanya asks.

## Published (live on heytadam.com)
| Article | Target keyword | Status |
|---|---|---|
| `hanukkah-quiz` | חידון חנוכה | Written, playbook applied, labeled example scenario until a real story arrives |
| `office-holiday-toast` | הרמת כוסית לחג | Written, playbook applied, labeled example scenario until a real story arrives |
| `bar-mitzvah-attractions` | אטרקציות לבר מצווה | Written, playbook applied, labeled example scenario until a real story arrives |
| `team-building-day-ideas` | יום גיבוש לעובדים | Written, playbook applied, labeled example scenario until a real story arrives |
| `pass-the-parcel-tasks` | משימות לחבילה עוברת | Live since 2026-11-22. Labeled example scenario |
| `icebreaker-questions` | שאלות היכרות | Live since 2026-11-22. Labeled example scenario |
| `bachelorette-party-games` | משחקים למסיבת רווקות | Live since 2026-11-22. Labeled example scenario. Reader addressed with neutral plural imperatives, guests in the feminine |
| `tu-bishvat-quiz` | חידון טו בשבט | Live since 2026-11-22. Tu BiShvat is 23 Jan 2027 |
| `hanukkah-riddles` | חידות לחנוכה | Live since 2026-11-22. 9,900 searches last December. Update the dates in October 2027 |
| `hanukkah-games` | משחקים לחנוכה | Live since 2026-11-22. Bingo board and dreidel rules. Update the dates in October 2027 |
| `new-years-eve-at-home` | סילבסטר בבית | Live since 2026-11-22. Small bet: demand for at-home games is not proven. Update the date each December |
| `general-knowledge-trivia-questions` | שאלות טריוויה | Live since 2026-11-22. Article 12 of the original plan |

## Weekly task (set up 2026-11-22)
A scheduled task named "Tadam weekly blog articles" runs every Sunday at 08:36 Israel time, first run 2026-11-29. Each run starts a fresh cloud session that:
- picks 2 topics not covered yet (a seasonal topic 3 to 6 weeks away first, then "Next up" below, then new topics), checked with DataForSEO, at most $1 per run;
- writes both articles by the playbook, builds, updates these docs;
- opens ONE pull request and stops. It never merges. Tanya gets a push notification.

Tanya manages it (pause, change the day, edit the instructions) in her scheduled tasks on claude.ai, or by asking Claude in a session. Not yet tested: whether an unattended run gets push access to this repository. If the first run reports it could not push, fix the setup.

## What happened on 2026-11-22 (one session)
- Tanya asked for 4 more articles on topics people search. She chose "new research first" over the saved plan, then approved all 4 proposed topics.
- She then asked for 4 more around the end of the year. Research showed that year-end demand in Hebrew is Hanukkah, and she approved all 4 proposed topics.
- All 8 were merged at her request and deployed. DataForSEO spend for the day: about $1.70.
- She asked whether the Cite-Me prompt was followed. Honest answer given: yes for research, headings, capsules, inline sources, tables and FAQ; but the structure was not sent for her approval before drafting, and she was not asked for first-hand stories before drafting. She accepted that. With her in the conversation, prefer to show the headings first unless a deadline is close.
- Working pattern that went well (Claude's reading, not something Tanya said): one recommendation with search numbers, a short list to approve, then plain summaries with preview links.

## Open items after 2026-11-22
- **Tanya:** request indexing in Search Console for the 8 new addresses, `hanukkah-riddles` and `hanukkah-games` first (Hanukkah starts 4 Dec 2026).
- **Offered, not yet answered:** add more verified sources to `pass-the-parcel-tasks` (1 source), `icebreaker-questions` (2) and `bachelorette-party-games` (1). Only sources that support something the article says.
- **Offered, not yet answered:** real stories to replace the labeled example scenarios in any of the 8.
- **Easy to remove if Tanya prefers:** the Shabbat FAQ in `pass-the-parcel-tasks`.

## English translations (2026-11-22, `/en/blog/`)

All 12 articles are translated in `src/content/blog-en/` (same file names), for English speakers in Israel.
English search volume in Israel was checked on 2026-11-22 (`data/seeds-english-il.txt`, `data/volume-english-il-2026-11-22.csv`, $0.09).
It is small: most phrases get 10 to 40 searches a month. The exceptions, now used in titles and `targetKeyword`:
"general knowledge questions" 590, "icebreakers" 590, "trivia questions" and "trivia quiz" 210 each, "general knowledge quiz" 170.
"Bar mitzvah attractions", "office holiday toast" and "team-building day ideas" have no measurable volume, so those titles lead with
"bar mitzvah ideas", "holiday toast" and "team building activities". "Tu bishvat" alone gets 720, the quiz phrase 10.
Titles are in Title Case. Unclear transliterated terms carry the Hebrew word in parentheses.
Hebrew wordplay was replaced with English wordplay in `hanukkah-riddles` (emoji riddles 16, 18, 19, behead-the-word 23 to 26,
sound-alikes 27 to 32, hard riddles 39 and 45) and one tongue twister in `pass-the-parcel-tasks` (item 4).
A new Hebrew article needs its English twin.

## Waiting for Tanya: real stories (never invent them)
Each article now has one clearly labeled example scenario ("תרחיש לדוגמה (לא אירוע אמיתי)", Tanya's choice on 2026-11-16) and a hidden marker where the real story goes (`grep -n "להחליף בסיפור" src/content/blog/*.md`). When a real story arrives, it replaces the scenario in that article. 2 or 3 sentences each:
1. **Family / Hanukkah:** a family event where Tadam was played. Who won, which question got the biggest laugh.
2. **Bar/bat mitzvah:** a real moment (for example the grandmother beat the classmates), plus a quote from a parent or guest.
3. **Company / team:** team size and which team question worked best, plus a quote from a manager or employee.

4. **Second round (2026-11-22):** a birthday or party with pass the parcel, a team or class opening with getting-to-know-you questions, a bachelorette party, a Tu BiShvat family evening.

## Decisions for Tanya
- **Custom domain: done (2026-11-17).** The site is on https://heytadam.com (`site` in `astro.config.mjs` and the sitemap line in `public/robots.txt` updated). Google Search Console: heytadam.com verified as a Domain property on 2026-11-17 (TXT `google-site-verification=…` in Netlify DNS; never delete it, or verification is lost). Sitemap `https://heytadam.com/sitemap-index.xml` submitted and the home page sent for indexing the same day (a Domain property needs the full sitemap URL, not just the file name).
- **Business page** (`/לחברות` or `/business`) with its own copy and pricing. Until then, company articles point to the demo and Messenger.
- **English version** for global teams and the US market (bigger volumes, harder competition, outside the Hebrew-only brief).
- **Feature images:** none for now (her choice).
- **Directory listings** (karamel.co.il, mesibonet.co.il): AI Overviews quote them. Free listings first; a paid listing needs her OK.

## Next articles (order from `keyword-research-2026-11.md`)
Next up: 3 אטרקציות לבת מצווה, 4 רעיונות למסיבת בת מצווה, 6 הפעלה לבר ובת מצווה, 20 ערב צוות, 21 משחקי גיבוש, 10 איך מכינים משחק טריוויה לאירוע. (Article 12, 100 trivia questions, was written on 2026-11-22.)
Seasonal deadlines (publish 3 to 4 weeks before):
- Family Day (יום המשפחה, 7 Feb 2027): a "family quiz for Family Day" article, publish in January (see the second research round)
- Purim quiz (חידון פורים, 720/month) and a גמד ענק guide (peaks at 1,900 in February): publish by early February
- Passover quiz and office Passover toast (חידון פסח 720, הרמת כוסית לפסח 110): publish by early March
- School year-end party (מסיבת סיום כיתה ו): publish in April
- Rosh Hashanah toast (הרמת כוסית לראש השנה): publish in August
- Hanukkah 2027: the quiz, riddles and games articles exist; update the dates in them in October 2027

## After publishing on the real domain
- Done 2026-11-17: sitemap submitted in Google Search Console. After each new article is live, request indexing for its URL in URL inspection.
- Check Search Console (Pages, Performance) about a week after 2026-11-17 for indexing problems.
- Re-check rankings and AI Overview sources for the target keywords at 4 and 8 weeks: `python3 tools/seo/research.py serp --file <keywords>` (about $0.002 per keyword) and compare with `docs/seo/data/serp-2026-11-16.csv`.
- Done 2026-11-18: favicon fixed (square icons + Organization logo in structured data), live on production, and indexing requested for `https://heytadam.com/`. Google can take days to weeks to show the icon in results; if the globe is still there by early December, check URL inspection for the homepage.
- Answer the forum and Facebook threads that rank (stips.co.il, Facebook groups and Reddit all show up on page 1 for event questions).

## Known issues
- **Gemini key:** saved in the cloud environment with the `Authorization` header, which the Gemini API rejects. Image generation from this environment needs the secret saved with the `x-goog-api-key` header instead.
- **Sandbox network:** the cloud session can't open Netlify preview URLs or most outside sites. Sources are checked by web search; previews are checked by Tanya. Update 2026-11-22: `curl https://heytadam.com/...` does work from the cloud session, so live pages and the sitemap can be checked after a deploy.
- **`astro check`:** 5 pre-existing type errors in `src/scripts/demo-modal.ts` (`dialog` possibly null), not from the blog.
