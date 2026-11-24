# Session record: setting up the US site (24 November 2026)

This is the record of the Claude Code session in which the US site was split off from the Israeli one. The chat itself is filed under the old `tadam` repository in the Claude app and can't be moved, so its content is kept here, with the US code. Work continues in the session "Tadam US site: wave 1 articles" (https://claude.ai/code/session_01H7Q5SV59uCG49Axh4WLYY8).

## 1. Repositories
- **`tanyarofman/tadam` was renamed to `tanyarofman/tadam-il`** (by Tanya, in GitHub settings). It is the Israeli Hebrew site on heytadam.com. GitHub forwards the old name.
- **`tanyarofman/tadam-us` was created** (empty, by Tanya). All 62 branches and the full history of the Israeli repository were copied into it. Before any changes it matched the original commit for commit.
- The Netlify project `heytadam` followed the rename by itself and now builds from `tadam-il`.
- The weekly Hebrew blog task ("Tadam weekly blog articles", Sundays 08:36 Israel time) was updated to name `tadam-il`. It never touches this repository.

## 2. Netlify and the domain
- **The Netlify project `tadam-us` was created** and linked to this repository. It deploys `main` to https://tadam-us.netlify.app, every pull request gets a preview at `deploy-preview-<number>--tadam-us.netlify.app`, and the first deploy went out on 24 Nov. The Netlify GitHub app already had access to the new repository, so previews work.
- **The domain question.** Tanya first considered moving heytadam.com to the US site and giving the Israeli site a new `.il` domain. The SEO cost was explained:
  - Google transfers rankings only when the old address redirects to the same page on the new domain ("Change of address" in Search Console).
  - If heytadam.com became the US site, its home page could not redirect, so most of the Israeli rankings would have been lost.
  - Pages that exist only on the Israeli site could still have been redirected from the US site.
- **Decision (Tanya, 24 Nov): heytadam.com stays with the Israeli site.** The US site gets a new domain with a different name, still to be bought.
- **Until then:**
  - The site address in the code is tadam-us.netlify.app (`astro.config.mjs`, `public/robots.txt`).
  - Every page is sent with an `X-Robots-Tag: noindex` header (`netlify.toml`).

  When the domain exists, change both and remove the header.

## 3. Decisions Tanya made (24 Nov)
- **English only,** at the root. The Hebrew version is not part of this site.
- **Markets:** the US first, then the UK and Ireland. English searches in continental Europe are too small to target on their own and are served by the US and UK articles.
- **Events to lead with:** all four groups (birthdays and milestones, weddings and showers, companies and teams, holidays and family).
- **Existing blog:** rewrite the articles that work outside Israel, delete the Israel-only ones, and add new articles from the research.
- **DataForSEO budget for the first round:** up to $10.
- **Work continues in a session filed under `tadam-us`,** and this record keeps the history in the repository.

## 4. Research (summary)
Full findings: `docs/seo/keyword-research-us-2026-11.md`. Site review: `docs/seo/site-review-us-2026-11.md`. Spent $2.37 of the $10.
- **People don't search for the product; they search for the event.** "Personalized trivia game" gets 30 searches a month in the US. The best fit is questions about the guest of honor:

  | Search | Monthly US searches |
  |---|---|
  | newlywed game questions | 8,100 |
  | how well do you know me questions | 5,400 |
  | wedding shoe game questions | 3,600 |

- **Big event searches:**

  | Search | Monthly US searches |
  |---|---|
  | bridal shower games | 40,500 |
  | sweet 16 party ideas | 27,100 |
  | 40th birthday ideas | 12,100 |
  | 50th birthday party ideas | 8,100 |
  | team building activities for work | 12,100 |
  | retirement party ideas | 5,400 |

- **Competition is weak.** Pinterest, Reddit and small blogs take most of the top 10, and AI Overviews appeared on 46 of the 50 results pages checked.
- **The UK is a real second market with its own words:**

  | UK search | Monthly UK searches |
  |---|---|
  | general knowledge quiz | 60,500 |
  | christmas quiz | 22,200 |
  | hen party games | 9,900 |
  | mr and mrs quiz questions | 6,600 |

- **Existing articles:**
  - Rewrite 9 for the US: trivia, icebreakers, bachelorette, team building, office party, New Year's Eve, dreidel and Hanukkah games, Hanukkah trivia, bar and bat mitzvah.
  - Keep `pass-the-parcel-tasks` as a UK article.
  - Delete `hanukkah-riddles` and `tu-bishvat-quiz`.

## 5. Pull requests from this session
| PR | What | Status |
|---|---|---|
| #1 | CLAUDE.md for the US and Europe site | Merged 24 Nov at Tanya's request |
| #2 | Research, site review, article plan; `research.py --market` | Merged 24 Nov |
| #3 | English-only site at the root (Hebrew pages, language switch, hreflang and country redirect removed; US copy; Service and FAQPage structured data; English `llms.txt`; noindex until launch; `/en/*` redirects to `/`) | Merged 24 Nov; production deploy succeeded |

The new session then wrote wave 1: #4 (articles 1 to 4) and #5 (articles 5 to 8), both merged.

## 6. Wave 1 (headings approved by Tanya on 24 Nov)
Each H2 is a question people search (from the DataForSEO question data).

| # | Article | Monthly US searches |
|---|---|---|
| 1 | `newlywed-game-questions`: 100 Newlywed Game Questions: Funny, Clean and a Little Spicy | 8,100 |
| 2 | `wedding-shoe-game-questions`: Wedding Shoe Game Questions: 60 Ideas and How to Run It | 3,600 |
| 3 | `how-well-do-you-know-me-questions`: 100 How Well Do You Know Me Questions for Friends, Family and Couples | 5,400 |
| 4 | `bridal-shower-games`: 25 Bridal Shower Games Guests Actually Enjoy | 40,500 |
| 5 | `bridal-shower-trivia-questions`: Who Knows the Bride Best? 75 Bridal Shower Trivia Questions | about 1,200 |
| 6 | `40th-birthday-party-ideas`: 40th Birthday Party Ideas: 30 Ways to Celebrate Turning 40 | 12,100 |
| 7 | `50th-birthday-party-ideas`: 50th Birthday Party Ideas: 30 Ways to Celebrate Half a Century | 8,100 |
| 8 | `super-bowl-party-games`: Super Bowl Party Games: 20 Ideas for Fans and Non-Fans | 1,900, plus 1,900 for "super bowl trivia" |

Left out on purpose:
- budget questions, because articles never show prices
- color and dress questions, because they have nothing to do with a game
- team, player or betting content in the Super Bowl article

## 7. Waiting for Tanya
- **The US domain.** Then change `site`, `robots.txt`, `src/config/site.ts` and `netlify.toml`, remove the noindex header, and set up Search Console.
- **The US contact route.** Buttons still open Messenger on the Israeli Facebook page, and the public email is hey@heytadam.com. Marked `TODO (Tanya)` in `src/config/site.ts`.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **Prices in USD/EUR.** They're hidden for now (`src/config/pricing.ts`).
- **A privacy policy for the US and the EU.** Claude can draft it; a legal check is advised.
- **FAQ wording:**
  - how Tadam compares with Kahoot or Jackbox
  - whether remote guests can play
  - how far ahead to order
- **An optional second demo** (a wedding or a 40th) to match the main US searches.
- **Real event stories** to replace the labeled example scenarios in the articles.
- **The demo video on the home page** shows "Play GTA VI" as an answer, which is a real game title. Consider re-recording that question.

## 8. Where to continue
The session "Tadam US site: wave 1 articles": https://claude.ai/code/session_01H7Q5SV59uCG49Axh4WLYY8. Next in the plan:
- the 9 rewrites and 2 deletions of existing articles
- waves 2 to 4 and the UK set (see the research file)
- a weekly article task for this site, only if Tanya wants one
