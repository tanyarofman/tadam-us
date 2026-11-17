# Blog status and to-dos

Last updated: 2026-11-16. Work is on branch `claude/gifted-edison-r7zran`, pull request [tanyarofman/tadam#30](https://github.com/tanyarofman/tadam/pull/30) (not merged; merge only when Tanya asks). Netlify also builds a deploy preview for the PR automatically.

## Published on the branch
| Article | Target keyword | Status |
|---|---|---|
| `hanukkah-quiz` | חידון חנוכה | Written, playbook applied, labeled example scenario until a real story arrives |
| `office-holiday-toast` | הרמת כוסית לחג | Written, playbook applied, labeled example scenario until a real story arrives |
| `bar-mitzvah-attractions` | אטרקציות לבר מצווה | Written, playbook applied, labeled example scenario until a real story arrives |
| `team-building-day-ideas` | יום גיבוש לעובדים | Written, playbook applied, labeled example scenario until a real story arrives |

## Waiting for Tanya: real stories (never invent them)
Each article now has one clearly labeled example scenario ("תרחיש לדוגמה (לא אירוע אמיתי)", Tanya's choice on 2026-11-16) and a hidden marker where the real story goes (`grep -n "להחליף בסיפור" src/content/blog/*.md`). When a real story arrives, it replaces the scenario in that article. 2 or 3 sentences each:
1. **Family / Hanukkah:** a family event where Tadam was played. Who won, which question got the biggest laugh.
2. **Bar/bat mitzvah:** a real moment (for example the grandmother beat the classmates), plus a quote from a parent or guest.
3. **Company / team:** team size and which team question worked best, plus a quote from a manager or employee.

## Decisions for Tanya
- **Custom domain** before publishing (update `site` in `astro.config.mjs` and the sitemap line in `public/robots.txt`). Articles on `tadam-game.netlify.app` build authority on a temporary address.
- **Business page** (`/לחברות` or `/business`) with its own copy and pricing. Until then, company articles point to the demo and Messenger.
- **English version** for global teams and the US market (bigger volumes, harder competition, outside the Hebrew-only brief).
- **Feature images:** none for now (her choice).
- **Directory listings** (karamel.co.il, mesibonet.co.il): AI Overviews quote them. Free listings first; a paid listing needs her OK.

## Next articles (order from `keyword-research-2026-11.md`)
Next up: 3 אטרקציות לבת מצווה, 4 רעיונות למסיבת בת מצווה, 6 הפעלה לבר ובת מצווה, 20 ערב צוות, 21 משחקי גיבוש, 10 איך מכינים משחק טריוויה לאירוע.
Seasonal deadlines (publish 3 to 4 weeks before):
- Purim quiz (חידון פורים, 720/month): publish by early February
- Passover quiz and office Passover toast (חידון פסח 720, הרמת כוסית לפסח 110): publish by early March
- School year-end party (מסיבת סיום כיתה ו): publish in April
- Rosh Hashanah toast (הרמת כוסית לראש השנה): publish in August

## After publishing on the real domain
- Submit `sitemap-index.xml` in Google Search Console.
- Re-check rankings and AI Overview sources for the target keywords at 4 and 8 weeks: `python3 tools/seo/research.py serp --file <keywords>` (about $0.002 per keyword) and compare with `docs/seo/data/serp-2026-11-16.csv`.
- Answer the forum and Facebook threads that rank (stips.co.il, Facebook groups and Reddit all show up on page 1 for event questions).

## Known issues
- **Gemini key:** saved in the cloud environment with the `Authorization` header, which the Gemini API rejects. Image generation from this environment needs the secret saved with the `x-goog-api-key` header instead.
- **Sandbox network:** the cloud session can't open Netlify preview URLs or most outside sites. Sources are checked by web search; previews are checked by Tanya.
- **`astro check`:** 5 pre-existing type errors in `src/scripts/demo-modal.ts` (`dialog` possibly null), not from the blog.
