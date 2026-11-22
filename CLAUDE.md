# טדאם! (tadam) landing page

See README.md for how to run, switch themes and edit copy.

## Workflow

- Never commit directly to `main`. Do every change on a branch (`feat/…`, `fix/…`, `chore/…`) and open a pull request for review.
- Merge only when Tanya asks. Netlify (site `heytadam`, linked to this repo) deploys `main` to production automatically on every merge; no manual deploy step. Check the deploy in the Netlify API (`/api/v1/sites/<id>/deploys`).
- Every PR gets an automatic Netlify deploy preview (`deploy-preview-<number>--heytadam.netlify.app`) to share in the PR.

## Rules from the brief

- The site is Hebrew, RTL, parents addressed in plural (אתם), no em-dashes in copy.
- English version (`/en/` and `/en/privacy`, for English speakers in Israel): a straight translation of the Hebrew landing page, not a different story. Change `src/content/copy.he.ts` first, then mirror it in `src/content/copy.en.ts` (same keys; `npm run check` fails if they drift). The blog is Hebrew only. A site for the US and Europe is a separate project, not this repo.
- Never show real celebrities, athletes or recognizable characters; the host is always generic.
- Ask before adding a paid service, changing the story order, or using an image of a real person.

## Blog & SEO

- Articles: one Markdown file each in `src/content/blog/`, schema in `src/content.config.ts`, template `src/pages/blog/[slug].astro`. `/llms.txt` is generated from them.
- Start here: `docs/seo/status.md` (what's done, what's waiting for Tanya, next articles). Plan and findings: `docs/seo/keyword-research-2026-11.md` (29-article plan) and `docs/seo/keyword-research-2026-11-22.md` (second round, new topics). How to write: `docs/seo/content-playbook.md`. Sources: `docs/seo/sources.md`.
- Writing rules: every H2 is the question people search, followed by a 2-sentence answer; one table; 3 to 5 internal links (other articles, `/#demo`, `/`); 4 FAQ items in the frontmatter; `seoTitle` max 60 and `description` max 155 characters (the build enforces it); no prices in articles.
- Link only sources you verified, inline on the phrase, never a sources list at the end. Log each one in `docs/seo/sources.md`.
- Never invent first-hand experience or quotes. Ask Tanya for real stories. Until one exists, a short example scenario is allowed only as a quote block labeled **"תרחיש לדוגמה (לא אירוע אמיתי):"**, never presented as real. A hidden `[//]: # "להחליף בסיפור אמיתי..."` marker shows where the real story goes.
- Keyword research: DataForSEO via `tools/seo/research.py` (the API login is a network secret in the cloud environment). Israel = `location_code 2376`; see `docs/seo/how-to-research.md`. Ask before spending more than a few dollars.
