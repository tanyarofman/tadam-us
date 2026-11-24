# 2026-11-24: blog wave 1 and the tadamevents.com launch

Session record (follows `2026-11-24-us-site-setup.md` from PR #6).

## Blog wave 1 (8 articles, merged)
- **PR #4, merged:** `newlywed-game-questions`, `wedding-shoe-game-questions`, `how-well-do-you-know-me-questions` and `bridal-shower-games`. It also updated CLAUDE.md's status section: steps 2 to 4 are done.
- **PR #5, merged:** `bridal-shower-trivia-questions`, `40th-birthday-party-ideas`, `50th-birthday-party-ideas` and `super-bowl-party-games`.
- Headings were approved by Tanya before drafting. Questions came from the saved DataForSEO data, so there was no new spend: still $2.37 of the approved $10.
- Every article passed a check script: no em or en dashes, one table, 4 FAQ items, 3 to 5 working internal links, and question H2s with 2-sentence capsules. Playwright at 390px showed no overflow and tables that fit.
- Sources were checked by web search and logged in `docs/seo/sources.md`. nfl.com, paperlesspost.com, toastmasters.org and history.com don't open from the cloud sandbox.
- The 2027 game date (Sunday, Feb 14, 2027) was confirmed through Wikipedia and news sites, not on nfl.com.

## Domain and email
- Tanya bought **tadamevents.com**. It is in Netlify DNS and is the custom domain of the Netlify project `tadam-us`.
- **Email:** Forward Email records (MX, the `forward-email` TXT and SPF) were copied from the heytadam.com zone to the tadamevents.com zone. hey@tadamevents.com forwards to the same two Gmail inboxes as hey@heytadam.com. Tanya should send a test email.
- **PR #8:** the site address becomes tadamevents.com, the `noindex` header is removed, and the public email becomes hey@tadamevents.com. Tanya asked for this; it merges when she says so.

## Open items
- Add tadamevents.com to Search Console (and Bing Webmaster Tools), then submit the sitemap.
- The US contact route: buttons still open Messenger on the Israeli Facebook page.
- Real event stories for the 8 articles, and whether remote guests can play.
- The 404 page overflows by 16px at 390px. A task was suggested for it.
- Next writing work: rewrite the 9 existing articles for the US, showing Tanya the headings first.
