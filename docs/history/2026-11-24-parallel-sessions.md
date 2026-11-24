# 2026-11-24: indexing requests, and five sessions for the rest of the blog plan

Session record from the cloud session that wrote blog wave 1 (see `2026-11-24-wave1-and-domain.md`). This part of the session ran after the local session described in `2026-11-24-us-rewrites-and-launch-checks.md`.

## Search Console and Bing
- Tanya confirmed:
  - the tadamevents.com Domain property is verified;
  - both sitemaps show Success, with 22 pages. That count is from before PR #14 removed 2 articles and renamed one;
  - Bing Webmaster Tools imported the property from Search Console;
  - Ilan has Full access in Search Console.
- **Request indexing** (about 10 a day):
  - Done on 24 Nov: the home page, /blog/, and the articles from the top of the blog index down to `general-knowledge-trivia-questions`.
  - Next, US articles first: `how-well-do-you-know-me-questions`, `icebreaker-questions`, `newlywed-game-questions`, `super-bowl-party-games`, `team-building-activities-for-work`, `wedding-shoe-game-questions`.
  - Then the old ones: `hanukkah-games`, `hanukkah-quiz`, `new-years-eve-at-home`, `office-holiday-toast`, `pass-the-parcel-tasks`. Request each again once it is rewritten.
  - Never request the redirected addresses: `team-building-day-ideas`, `hanukkah-riddles`, `tu-bishvat-quiz`.
- **Google Analytics 4:** not set up. A suggested task, "Connect Google Analytics 4 to tadamevents.com", was left for Tanya to start later. It includes the EU/UK consent question and an update to the privacy page.

## Sessions opened at Tanya's request
Each one is told to:
- read CLAUDE.md, `docs/history/` and `status.md` first;
- show Tanya the headings and wait for her approval before drafting;
- run `tools/seo/check_articles.py`, `npm run check` and `npm run build`, then `tools/seo/check_mobile.mjs`;
- put deploy-preview links in each PR and never merge without Tanya;
- stay out of the other sessions' files and pull main before each PR;
- add its own record here at the end.

| Session | Articles | Notes |
|---|---|---|
| Rewrites | `hanukkah-games`, `hanukkah-quiz`, `new-years-eve-at-home`, `office-holiday-toast` (as office Christmas party games, with a 301 if the slug changes), `pass-the-parcel-tasks` (kept as a UK article) | Told to do the Hanukkah pair first. See "Mismatch" below. |
| Wave 2 | couples shower, engagement party, rehearsal dinner, reception games, baby shower, 30th, 60th, retirement | PR order: 30th and 60th, then 3 wedding articles, then baby shower, engagement and retirement. DataForSEO up to about $2. |
| Wave 3 | graduation party games, family reunion games, family trivia, 50th anniversary, team trivia for work, virtual team building, sweet 16 | PR order: the 2 work articles, then graduation, 50th anniversary and sweet 16, then family. Ready by about March 2027. Up to about $1.50. |
| Wave 4 | Christmas trivia, Christmas family games, Thanksgiving family games, Friendsgiving games | Asks Tanya whether the Christmas pair is for this December or 2027. Thanksgiving and Friendsgiving are for October 2027. Up to about $1. |
| UK set | Mr and Mrs quiz questions, hen party games, and a UK Christmas quiz if Tanya says yes | Asks Tanya about British spelling and title case for UK articles, and records the answer in CLAUDE.md. Up to about $1. |

The DataForSEO round is still capped at $10, shared by all sessions; $2.91 was spent before they started. Each session reads the running total in `status.md` and asks Tanya before going over.

## How the open questions were settled (later on 24 Nov)
- **Hanukkah, now or next year:**
  - Tanya chose now. The rewrite session shipped the Hanukkah pair first: `hanukkah-games`, and `hanukkah-trivia`, which was renamed from `hanukkah-quiz` with a 301 redirect (PR #15).
  - New Year's Eve, the office party and pass the parcel followed in PR #21, renamed to `new-years-eve-games` and `office-christmas-party-games`, both with 301 redirects.
  - See `2026-11-24-seasonal-rewrites.md`.
- **Christmas, now or next year:** Tanya chose this December. See `2026-11-24-wave4-holidays.md`.
- **Bar and bat mitzvah:**
  - Tanya dropped the rewrite and asked to hide the page.
  - Another session had already done it on main (PRs #24 and #32): `draft: true` and a temporary 302 redirect to /blog/.
  - This session's PR #30 did the same and was closed as a duplicate.
  - No article links to the page; the pass the parcel rewrite removed the last link.
  - Don't rewrite or republish it until Tanya asks.
- **Search Console indexing:**
  - A dedicated session, "Tadam US: Search Console indexing", now tracks the Request indexing list. PR #36 holds it in priority order.
  - Use that list instead of the one above, which was written before the renames.

## Lessons for parallel sessions
- Before opening a PR for a shared decision (a page to hide, a status line), pull main and check whether another session already did it. PR #30 duplicated #24 and #32.
- When a slug is renamed, the old address must get a 301, and indexing lists written earlier go stale.

## Open
- The items under "Waiting for Tanya" in `docs/seo/status.md`.
- **Google Analytics 4:** the suggested task "Connect Google Analytics 4 to tadamevents.com" has not been started.
- Wave 2 and wave 3 sessions: see their own records in `docs/history/`, and `status.md` for what is still waiting for headings or a merge.
