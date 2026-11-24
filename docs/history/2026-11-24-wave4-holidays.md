# 2026-11-24: blog wave 4, holiday articles

Session record. Three other sessions worked in parallel: the Hanukkah, New Year's Eve, pass the parcel and office Christmas party rewrites; wave 2; and wave 3. This session wrote 4 of the 5 wave 4 articles. The office Christmas party article (the `office-holiday-toast` rewrite) belongs to the rewrite session.

## Decisions
- **Christmas articles fast, for December 2026** (Tanya's choice). US searches for "christmas trivia" rise from about 33,000 in November to about 301,000 in December. "christmas family games" peaks at about 40,500.
- **Thanksgiving and Friendsgiving are for next season.** Thanksgiving 2026 was on November 26, so these need to be live by early October 2027.
- **Christmas trivia has 60 questions**, not 100 (Tanya), so every answer could be checked in time.
- All four articles had their headings approved by Tanya before drafting (Cite-Me phase 2). There are no real stories yet, so each article uses one labeled example scenario plus the hidden marker.
- **The Tadam section uses the self-serve wording** ("you add the stories... Tadam turns them into"). The older articles still say "you send us... we build", which no longer matches the Paddle copy. That fix is open (see below).

## PRs
- **#23** (`feat/wave4-christmas`): `christmas-trivia-questions` (60 questions, 51 sources) and `christmas-games-for-family` (25 games).
- **#28** (`feat/wave4-thanksgiving`): `thanksgiving-family-games` (25 games, 12 trivia questions) and `friendsgiving-games` (20 games), plus this record.
- Neither is merged. Merge only when Tanya says so, then use Request indexing in Search Console.

## Fact checking
- Every trivia answer was checked by web search against Britannica, the Library of Congress, the Smithsonian, the National Archives, NPS, NOAA, USDA and others. Results are logged in `docs/seo/sources.md`.
- Claims left out because sources disagree or are missing: Alabama in 1836 as the first state to make Christmas a holiday, the year candy canes got stripes, the exact end date of the twelve days, the first Macy's parade (a brand, and not the first Thanksgiving parade), and "the US is a top pumpkin producer".
- Franklin and the turkey: only the line from his unsent 1784 letter. Never "he wanted it as the national bird".

## DataForSEO
- One call: questions for christmas family games, christmas games for family, thanksgiving family games and friendsgiving games (`data/questions-us-wave4-2026-11-24.csv`, 202 rows). It cost $0.15.
- The balance went from $39.82 to $39.35 while other sessions were also spending. The round total is about $3.60 of the approved $10.

## Open
- Merge #23 soon, so it is live for December. Merge #28 any time before October 2027.
- After both merge, link the Christmas articles from the Thanksgiving ones and back again. Also link `christmas-trivia-questions` from the office Christmas party and New Year's Eve rewrites.
- Rewrite the Tadam section of the older articles to the self-serve wording (separate PR).
- Real stories from Christmas, Thanksgiving or Friendsgiving games, to replace the example scenarios.
- A UK "Christmas quiz" version, if the UK set goes ahead.
