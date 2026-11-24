# Tadam! (tadam-us): the site for the US and Europe

Tadam is a personal live trivia game show for events: a game built from the stories of the people being celebrated, hosted on the big screen, played by every guest from their phone.

This repository is the **English site for the US and Europe**. The Israeli Hebrew site is a separate repository, `tanyarofman/tadam-il` (heytadam.com). Never change that repository from here, and don't copy Israel-specific content (Hebrew holidays, Israeli events, ₪ prices) into this one.

See README.md for how to run the site and where things live.

## Status (November 2026)

This repository started as a copy of the Israeli site. The plan, in order:

1. This CLAUDE.md (done).
2. Market research with DataForSEO for the US, UK and English-speaking Europe: `docs/seo/keyword-research-us-*.md` (done, PR #2).
3. Cite-Me AI-search review of the whole site: `docs/seo/site-review-us-*.md` (done, PR #2).
4. English only at the root (done, PR #3): the site and blog are served at `/`, with no Hebrew pages or RTL.
5. A US blog: rewrite the universal articles, delete the Israel-only ones, and add new articles from the research plan (in progress, see `docs/seo/status.md`).

## Workflow

- Never commit directly to `main`. Do every change on a branch (`feat/…`, `fix/…`, `chore/…`) and open a pull request for review.
- Merge only when Tanya asks. The Netlify project `tadam-us` (linked to this repository) deploys `main` to production automatically on every merge; there is no manual deploy step. Check deploys in the Netlify API (`/api/v1/sites/<id>/deploys`, site name `tadam-us`).
- Every PR gets an automatic deploy preview (`deploy-preview-<number>--tadam-us.netlify.app`) to share in the PR.
- **Domain:** https://tadamevents.com, in Netlify DNS and set as the Netlify project's custom domain. The address is in `astro.config.mjs` (`site`) and `public/robots.txt`. The public email hey@tadamevents.com forwards to Tanya's and Ilan's Gmail through Forward Email (MX and TXT records in the tadamevents.com DNS zone, copied from heytadam.com). The site is indexable: no `noindex`.

## Rules for the site

- **Language:** American English (US spelling; UK and European readers accept it). Address readers as "you". Plain and warm, like the current `src/content/copy.en.ts`. No em-dashes or en-dashes in copy.
- **Markets:** the US first, then the UK, Ireland and English-speaking Europe. Events, holidays, dates and examples come from these markets (birthdays and milestones, weddings and showers, companies and teams, holidays and family), not from Israel.
- **Prices:** none on the site until Tanya sets them in USD/EUR (`src/config/pricing.ts`; prices are hidden today). Never in blog articles.
- Never show real celebrities, athletes or recognizable characters; the host is always generic.
- Ask before adding a paid service, changing the story order, or using an image of a real person.
- Contact details, email and social links (`src/config/site.ts`) still point to the Israeli Facebook page and Messenger. Ask Tanya what the US site should use; don't invent accounts.

## Blog & SEO

- Articles: one Markdown file each, schema in `src/content.config.ts`, template `src/components/pages/BlogArticle.astro`. `/llms.txt` is generated from them. Articles live in `src/content/blog/` and are served at `/blog/<slug>/`.
- Start here: `docs/seo/status.md` (what's done, what's waiting for Tanya, next articles). How to write: `docs/seo/content-playbook.md` (the Cite-Me method). Sources: `docs/seo/sources.md`. The Hebrew research files in `docs/seo/` describe the Israeli market and are history only.
- Writing rules:
  - Every H2 is the question people search, followed by a 2-sentence answer of at most 50 words.
  - One table per article.
  - 3 to 5 internal links (other articles, `/#demo`, `/`).
  - 4 FAQ items in the frontmatter.
  - `seoTitle` max 60 and `description` max 155 characters (the build enforces it).
  - Titles in Title Case.
  - No prices.
- Sources: prefer US and UK authorities (.gov, .edu, established publications). Link only sources you verified, inline on the phrase, never as a sources list at the end. Log each one in `docs/seo/sources.md`.
- Never invent first-hand experience or quotes. Ask Tanya for real stories. Until one exists, a short example scenario is allowed only as a quote block labeled **"Example scenario (not a real event):"**, never presented as real. A hidden `[//]: # "Replace with a real story..."` marker shows where the real story goes.
- With Tanya in the conversation, show the headings (Cite-Me phase 2) before writing the draft.
- Seasonal articles go live 4 to 8 weeks before the date (US calendar: Super Bowl, Valentine's Day, spring wedding and shower season, graduation, Mother's and Father's Day, July 4th, Halloween, Thanksgiving, the holiday season, New Year's Eve).

## Keyword research

- DataForSEO through `tools/seo/research.py` (the API login is a network secret for `api.dataforseo.com` in the cloud environment). See `docs/seo/how-to-research.md`.
- Markets: US `location_code 2840` (main), UK 2826, Ireland 2372, Germany 2276, Netherlands 2528, all with `language_code "en"`.
- Check the balance before and after (free call: `GET /v3/appendix/user_data`) and log the spend. Ask Tanya before spending more than $10 in one round.
- Save raw data under `docs/seo/data/` with the date in the file name.

## Not in this repository

- The Israeli weekly blog task ("Tadam weekly blog articles") works on `tadam-il` only. A weekly task for this site doesn't exist yet; ask Tanya before creating one.
