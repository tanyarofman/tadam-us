# 2026-11-24: seasonal rewrites (Hanukkah, New Year's Eve, office party, pass the parcel) and the self-serve wording fix

Session record (cloud session). It follows `2026-11-24-us-rewrites-and-launch-checks.md`.

## What was done
- **PR #15, Hanukkah (urgent, Hanukkah starts at sundown Fri Dec 4):**
  - `hanukkah-games` now targets dreidel game (5,400) and hanukkah games (720). It has the dreidel rules step by step, a letters table, and the dreidel's origin as a gambling top (Library of Congress), plus 12 more games.
  - `hanukkah-quiz` became `hanukkah-trivia` (301). It has 30 holiday questions in three levels, including US ones (the 1979 public menorah lighting near the White House, Thanksgivukkah 2013), and 10 family questions.
- **PR #17, self-serve wording:** 12 articles from PR #14 and wave 1 said "send us your stories ... we build the game", which breaks the Paddle rule. Their Tadam paragraphs now match the home page: you type in the stories, add photos, pick a host and review the questions.
- **Seasonal PR 2:**
  - `new-years-eve-at-home` became `new-years-eve-games` (301). Sylvester and Novy God are gone. It adds games for adults, families and couples, 20 year-in-review questions, and the PLOS ONE resolutions study.
  - `office-holiday-toast` became `office-christmas-party-games` (301). It adds a 15-game table, White Elephant and Secret Santa, large and small groups, 60-second challenges, inclusion (SHRM) and remote colleagues (Gallup via Fortune).
  - `pass-the-parcel-tasks` is now in UK English. It covers forfeits and drops the Hebrew name, "the version in Israel" and the Shabbat FAQ.
- Headings for all five articles were approved by Tanya before drafting. There's no real story yet, so each article has a labeled example scenario and the hidden marker.
- **DataForSEO:** no spend. The questions came from `questions-us-rewrites-2026-11-24.csv`. The total is still $2.91 of $10.

## Decisions
- **Renames with 301s** (all Tanya's call): hanukkah-quiz to hanukkah-trivia, new-years-eve-at-home to new-years-eve-games, office-holiday-toast to office-christmas-party-games. The US search terms are "trivia" and "games".
- **The wording fix is a separate PR,** so it can merge before Paddle's website review.
- **No TV-show names:** "Minute to Win It" (a search modifier) appears as "60-second challenges".
- **No claims about remote play in Tadam.** That's still open. The office article gives general remote advice only.

## Outcome (end of session)
- **Merged by Tanya on 2026-11-24:** #15 (Hanukkah), #17 (self-serve wording) and #21 (New Year's Eve, office party, pass the parcel; the session PR 2 above). #21 was rebased onto main after #15. The conflicts were in `bar-mitzvah-attractions`, `netlify.toml`, `status.md`, `sources.md` and the old `office-holiday-toast`. All six articles were rechecked (`check_articles.py`, `npm run check`, build) before the merge.
- **Production:** Netlify published `7dad8ef` (#15 and #17) at 15:55 UTC and `bff7576` (#21) at 15:56 UTC. tadamevents.com doesn't open from the cloud sandbox, so the live pages were confirmed through the Netlify API only.
- **Bar and bat mitzvah:** Tanya decided to hide the article for now, not rewrite it (`draft: true`, with a 302 to /blog/, in #30 and #32 by another session). No published article links to it.
- **Search Console indexing:** Tanya's Request indexing quota (about 10 a day) ran out on 2026-11-24.
  - PR #36 (merged) put the full list of 21 published URLs still waiting into `docs/seo/status.md`, in priority order: day 1 seasonal (Hanukkah, Christmas, office party, New Year's Eve, Super Bowl, 30th, 60th, pass the parcel), then year-round, with redirected and hidden addresses marked "never request".
  - Pages already requested come from `2026-11-24-parallel-sessions.md`. The articles before `general-knowledge-trivia-questions` were inferred from "the top of the blog index down to …", so Tanya should confirm them.
- **New session "Tadam US: Search Console indexing"** (`session_01H7Q5SZYMdWtoM4MNqwUTmH`), opened at Tanya's request for this one job. It gives Tanya a daily batch of up to 10 URLs, ticks them off in `status.md` through PRs it never merges on its own, and adds new articles once they're deployed. It asks Tanya once whether she wants a daily reminder.
- **DataForSEO:** no spend in this session.

## Open
- Request indexing, following the list in `docs/seo/status.md` (the indexing session tracks it).
- Real stories to replace the example scenarios in the five rewrites.
- Whether remote guests can play a Tadam game (the office article avoids the claim until this is known).
