# 2026-11-24: Coming soon page with an email signup

## What changed
- `/create` (where every "Create yours" button goes) is now a **Coming soon** page: "Your game show is almost ready.", an email field with a **Let me know** button, a "You're on the list" message after signing up, and links to the demo and the home page. It stays `noindex`.
- The page uses the site header and footer, so it feels like part of the site (Tanya's request). The header is a new component, `src/components/SiteHeader.astro`, which matches the home page header inside `Scene0Hero.astro` (keep the two in sync). The footer has a new `hideBrand` option, used on `/create` only, that leaves out the logo and tagline.

## Decisions
- **Signups go to Netlify Forms** (form name `launch-list`), included in the Netlify account (free plan: 100 submissions a month). No paid service was added. There's a hidden field to catch spam bots.
- Signups only save on Netlify (deploy previews and production). On the local dev server, the page shows the thank-you message without saving anything.

## Open items
- After the merge, check that Netlify detected the `launch-list` form (Netlify > tadam-us > Forms) and turn on email notifications for new signups.
- When the wizard is ready, replace `/create` with it and email the people on the list.
