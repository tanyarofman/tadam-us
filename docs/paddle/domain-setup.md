# tadamevents.com: setup status (done 2026-11-24)

| Item | Status |
|---|---|
| Domain `tadamevents.com` | Bought by Tanya, DNS in Netlify (zone `tadamevents.com`) |
| Repo | `tanyarofman/tadam-us` (the Israeli site is `tanyarofman/tadam-il`, formerly `tadam`) |
| Netlify project | `tadam-us` (site id `f4fc86e6-e3b7-4b5f-8de3-e5b7d626c91d`), deploys `main`, deploy previews on PRs |
| Primary address | `https://tadamevents.com`; `www.tadamevents.com` also points to the site |
| HTTPS | Let's Encrypt certificate issued for `tadamevents.com` and `*.tadamevents.com`, forced HTTPS |
| Email | `hey@tadamevents.com` through Forward Email (MX + TXT + SPF), forwarding to Tanya and Ilan |
| Indexing | `noindex` removed (tadam-us PR #8) |

Still open: Search Console / Bing Webmaster for tadamevents.com, and replacing the Messenger contact route (it still opens the Israeli Facebook page). heytadam.com is unchanged.
