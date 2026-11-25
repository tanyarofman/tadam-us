# 2026-11-24: Coming soon page with an email signup

Session record. The wizard and the Paddle checkout will take a few more days (setup and Paddle approval), so the "Create yours" buttons needed somewhere useful to land in the meantime.

## What changed
- `/create` (where every "Create yours" button goes) is now a **Coming soon** page: "Your game show is almost ready.", an email field with a **Let me know** button ("One email when it opens. No spam, ever."), a "Tadam! You're on the list." message after signing up, and links to the demo and the home page. It stays `noindex`.
- **PR #34, merged by Tanya's request** (squash, `de2a65e`). Live at https://tadamevents.com/create/ (checked after the deploy).

## How it got there
1. A first mock had its own logo at the top and the full footer.
2. Tanya: the page must feel seamless, so keep the site header and footer and change only the middle. No logo at the top of the content and no logo or tagline in the footer's bottom-left corner.
3. The header is a new component, `src/components/SiteHeader.astro`, which copies the home page header in `Scene0Hero.astro`: the navy bar, logo, nav links back to the home page sections, and the Create yours button. **Keep the two in sync.** The footer got a `hideBrand` option, used on `/create` only. Without the brand column, the footer shows 3 columns on desktop and 2 on phones.
4. Checked at 1366px (next to the home page) and 375px, and on the deploy preview.

## Footer line (checked after the merge)
- Tanya asked to check the footer rule and the latest main: the line is now "© <year> Tanya Rofman. Payments processed by Paddle.com." with **no country** (CLAUDE.md and `docs/paddle/`, PR #33). Main and the live `/create` already show it. The only place "Israel" appears in the site code is a code comment in `copy.en.ts`, which visitors don't see. No code change was needed.

## Decisions
- **Signups go to Netlify Forms** (form name `launch-list`), included in the Netlify account (free plan: 100 submissions a month). No paid service was added. A hidden field catches spam bots.
- Signups save only on Netlify (deploy previews and production). On the local dev server, the page shows the thank-you message without saving anything.

## Signup fix (2026-11-24 and 25)
- Tanya's first real signup showed "Something went wrong". Cause: **form detection was off** for the Netlify project (`processing_settings.ignore_html_forms: true`, the default on new Netlify sites). Netlify didn't know the `launch-list` form, so it answered every POST with a 404.
- Fix, with Tanya's OK: turned form detection on through the Netlify API and rebuilt production from main. Netlify then listed `launch-list` (fields `email` and `company`, the honeypot). No code change.
- Tanya's next signup arrived under Forms > `launch-list`.
- **Email notifications:** new `launch-list` submissions email hey@tadamevents.com, which forwards to Tanya and Ilan. The address is confirmed.
- **For future Netlify sites:** check that form detection is on (Forms page: "Form detection is enabled") before relying on a form.

## Open items
- When the wizard is ready, replace `/create` with it (keep `SiteHeader`) and email the people on the list (export: Forms > `launch-list` > Download as CSV).
