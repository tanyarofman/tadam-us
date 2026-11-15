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
