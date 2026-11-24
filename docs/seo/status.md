# Blog and SEO status (US and Europe site)

Last updated: 2026-11-24.

This repository started on 2026-11-24 as a copy of the Israeli site. The Israeli blog history and its plans are in `tadam-il` (and in this repository's git history). The older Hebrew research files in `docs/seo/` (`keyword-research-2026-11*.md`, `keywords-il.csv` and the `-il` data files) describe the Israeli market and are kept only for reference.

## Where things are
| What | File |
|---|---|
| Market research and article plan (US, UK, Ireland, Germany) | `keyword-research-us-2026-11.md` |
| Site review (Cite-Me AI search) with fixes and open decisions | `site-review-us-2026-11.md` |
| How to write an article | `content-playbook.md` (rules) and `CLAUDE.md` |
| How to research | `how-to-research.md`, `tools/seo/research.py --market us` |
| Verified sources | `sources.md` |

## Done
- 2026-11-24: first research round ($2.37 of the approved $10), the site review, and the article plan.

## Next
1. **English only at the root,** plus the site review fixes that need no decision (structured data, `llms.txt`, US locale and dates, the events strip, FAQ wording, and `noindex` on netlify.app).
2. **Existing articles:**
   - Rewrite 6 for the US: trivia questions, icebreakers, bachelorette games, team building, office party, New Year's Eve.
   - Rewrite 3 for US families: hanukkah games (dreidel), hanukkah trivia, bar and bat mitzvah.
   - Keep `pass-the-parcel-tasks` as a UK article.
   - Delete `hanukkah-riddles` and `tu-bishvat-quiz`.
3. **Wave 1 of new articles (January 2027):**
   - newlywed game questions
   - shoe game questions
   - how well do you know me questions
   - bridal shower games
   - bridal shower trivia
   - 40th and 50th birthday ideas
   - super bowl party games

   With Tanya in the conversation, show the headings before drafting.

## Waiting for Tanya
- **Domain:** to buy and add to the Netlify project `tadam-us`. Then change `site` in `astro.config.mjs`, `public/robots.txt`, `src/config/site.ts` and `netlify.toml`, verify the domain in Search Console, and submit the sitemap.
- **Contact route for the US:** an email address on the new domain, a separate social page, or the form only.
- **About facts:** who is behind Tadam, where you are, and how many games have been played. Real facts only.
- **Prices** in USD/EUR, or keep them hidden.
- **Privacy policy** for the US and the EU. Claude can draft it; a legal check is advised.
- **FAQ wording:** how to compare Tadam with Kahoot or Jackbox, whether remote guests can play, and how far ahead to order.
- **A second demo** (a wedding or a 40th) to match the main US searches. Optional.
- **Real stories** from events, to replace the labeled example scenarios.
- **A weekly article task** for this site, like the Israeli one. Only if Tanya wants it.
