# טדאם! (tadam) landing page

See README.md for how to run, switch themes and edit copy.

## Workflow

- Never commit directly to `main`. Do every change on a branch (`feat/…`, `fix/…`, `chore/…`) and open a pull request for review.
- Merge only when Tanya asks. Production deploys (`netlify deploy --dir dist --prod`) happen from `main` after a merge.
- A draft preview for a PR: `npm run build && netlify deploy --dir dist` (gives a draft URL to share in the PR).

## Rules from the brief

- Hebrew only, RTL, parents addressed in plural (אתם), no em-dashes in copy.
- Never show real celebrities, athletes or recognizable characters; the host is always generic.
- Ask before adding a paid service, changing the story order, or using an image of a real person.

## Blog & SEO

- Articles: one Markdown file each in `src/content/blog/`, schema in `src/content.config.ts`, template `src/pages/blog/[slug].astro`. `/llms.txt` is generated from them.
- Start here: `docs/seo/status.md` (what's done, what's waiting for Tanya, next articles). Plan and findings: `docs/seo/keyword-research-2026-11.md`. How to write: `docs/seo/content-playbook.md`. Sources: `docs/seo/sources.md`.
- Writing rules: every H2 is the question people search, followed by a 2-sentence answer; one table; 3 to 5 internal links (other articles, `/#demo`, `/`); 4 FAQ items in the frontmatter; `seoTitle` max 60 and `description` max 155 characters (the build enforces it); no prices in articles.
- Link only sources you verified, inline on the phrase, never a sources list at the end. Log each one in `docs/seo/sources.md`.
- Never invent first-hand experience. Leave a hidden `[//]: # "חוויה אישית: ..."` marker and ask Tanya for the real story.
- Keyword research: DataForSEO via `tools/seo/research.py` (the API login is a network secret in the cloud environment). Israel = `location_code 2376`; see `docs/seo/how-to-research.md`. Ask before spending more than a few dollars.
