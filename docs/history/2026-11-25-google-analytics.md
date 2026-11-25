# 2026-11-25: Google Analytics 4 on tadamevents.com

Session record from the session "Google Analytics 4 to tadamevents.com" (the one GA session, see `2026-11-25-analytics-session.md`).

## What happened
- Tanya created a new GA account **Tadam** (account 417440298) with the property **tadamevents.com** (565812876) and a Web data stream for https://tadamevents.com. **Measurement ID: `G-RNQE8BY438`** (not a secret). It is a separate account from her velonova.io account, so Ilan sees only Tadam.
- The site now loads gtag.js with Google Consent Mode v2 and sends the existing `track()` events to GA4.

## Decisions
- **Consent: option A** (Claude's recommendation; Tanya can still switch before the merge). Options were: A, a banner for Europe only with "Advanced" Consent Mode; B, the same but no Google requests in Europe before "Accept" ("Basic"); C, a banner for everyone.
  - Ads off everywhere: `ad_storage`, `ad_user_data`, `ad_personalization` always denied, Google signals and ad personalization off, ads data redaction on.
  - EEA, UK, Switzerland: `analytics_storage` denied by default (Google applies the region list by IP). Before "Accept", GA4 gets cookieless pings only.
  - Elsewhere: analytics cookies on by default, no banner.
  - The banner shows when the browser's time zone is in Europe and no choice is stored (no geo lookup service). "Cookie settings" in the footer and on the privacy page reopens it for anyone. The choice is in `localStorage` (`tadam-consent`); "Decline" also deletes `_ga` cookies.
- No paid consent service: the banner is our own (`src/components/ConsentBanner.astro`).
- gtag.js loads async, only on tadamevents.com and deploy previews, never on the local dev server. Previews set `debug_mode`, but Tanya's preview visit did not show in DebugView (it did in Realtime), so use Realtime to check.

## Code
- `src/components/Analytics.astro`: consent defaults, gtag config, async loader (in `<head>` via `Base.astro`).
- `src/components/ConsentBanner.astro`: the banner, "Cookie settings", and the site-wide `[data-track]` click listener (moved out of `main.ts` and `blog.ts`, so clicks are tracked on every page, including `/create` and the legal pages, and only once).
- `src/lib/analytics.ts`: `track()` calls `gtag("event", ...)`. Parameters: `source` is sent as `placement` (where the button is), `q` as `question` (FAQ). Unused event names removed (the lead form, Messenger and language switch are gone).
- `/create`: `launch_list_submit` fires after a successful signup (the old `data-track` on the form would have fired on every click inside the form).
- Privacy policy (`src/pages/privacy.astro` and `docs/paddle/privacy-policy.md`): usage data row, legal basis row (consent in the EU, UK, Switzerland; legitimate interests elsewhere), Google in the processor list, section 9 rewritten with the cookie table. Its date is now `legalPage.privacyUpdated` (November 25, 2026); terms and refunds keep November 24.

## Events in GA4
`cta_create_click`, `demo_open_big_screen`, `demo_modal_open`, `demo_modal_close`, `cta_how_it_works_click`, `cta_contact_click` (footer email), `faq_open`, `pricing_view`, `blog_demo_click`, `blog_contact_click`, `launch_list_submit`. Plus GA4's enhanced measurement (page views, scrolls, outbound clicks, form interactions, video).

## Checks
- `npm run check` (0 errors) and `npm run build` pass.
- Browser test with a Berlin time zone: banner shows, consent defaults queued, "Accept" sends the consent update, a footer click queues `cta_contact_click` with `placement: footer`. New York time zone: no banner. (googletagmanager.com is blocked in the cloud container, so the real requests are checked on the deploy preview and in GA4 Realtime.)

- **Deploy preview (PR #53), checked by Tanya in GA4 Realtime:** 1 active user and the events `page_view`, `first_visit`, `scroll`, `pricing_view`, `cta_create_click`, `cta_how_it_works_click`. DebugView stayed empty.
- **Merged on Tanya's request** (2026-11-25).

## Open (Tanya)
- In GA4 Admin: data retention 14 months; Search Console link (needs an owner of the Search Console property); add Ilan as Administrator.
- After the merge: open the site, check GA4 Reports > Realtime; mark key events (Admin > Events): `launch_list_submit` and `cta_create_click` suggested.
- Optional: register `placement` as a custom dimension (Admin > Custom definitions, event scope) to see which button was clicked.
- Our own visits (Tanya, Ilan) are counted. Optional later: define internal traffic by IP (Admin > Data streams > Configure tag settings > Define internal traffic) and activate the filter.
- The lawyer's review of `/privacy` now includes the analytics wording.
