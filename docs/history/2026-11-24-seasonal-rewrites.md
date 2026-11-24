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

## Merge order and conflicts
#15 and seasonal PR 2 both touch `bar-mitzvah-attractions` (the same line), `netlify.toml` and `status.md`, and #15 edits the old `office-holiday-toast`, which PR 2 renames. Whichever merges second needs a rebase; Claude does it on request. #17 is independent.

## Open
- After each merge, Request indexing in Search Console for the new URLs (`/blog/hanukkah-games/`, `/blog/hanukkah-trivia/`, `/blog/new-years-eve-games/`, `/blog/office-christmas-party-games/`, `/blog/pass-the-parcel-tasks/`).
- Real stories to replace the example scenarios.
- `bar-mitzvah-attractions` is the last old article still to rewrite (Israeli details remain, such as the kova tembel scenario).
