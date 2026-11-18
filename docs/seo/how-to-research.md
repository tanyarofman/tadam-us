# How the keyword research was done (and how to repeat it)

## Access
- **DataForSEO** (Tanya's account, pay as you go). In the Claude Code cloud environment the API login is saved as a network secret for `api.dataforseo.com`, so requests need no credentials in code. Elsewhere: set `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` (the API password from the dashboard's "API Access" page, not the website password).
- Free check that access works (no cost): `GET https://api.dataforseo.com/v3/appendix/user_data` (shows the balance).
- Spent on the first research round (2026-11-16): about $1.30.

## Script
`tools/seo/research.py` wraps the four calls below. Examples in its header. Seed keyword lists are in `docs/seo/data/`.

## Settings that work for Israel
| What | Endpoint | Settings | Notes |
|---|---|---|---|
| Monthly volume, CPC, competition | `keywords_data/google_ads/search_volume/live` | `location_code: 2376`, **no** `language_code` | `language_code: "he"` is rejected. $0.09 per call, up to 1,000 keywords. |
| Related keyword ideas | `dataforseo_labs/google/keyword_suggestions/live` | `location_code: 2376`, `language_code: "he"`, `limit: 300` | Much richer than Google Ads `keywords_for_keywords`, which returns almost nothing for Hebrew. About $0.05 per seed. Lots of noise (cities, cakes, Windows); filter by topic. |
| Who ranks + AI Overview sources | `serp/google/organic/live/advanced` | `location_code: 2376`, `language_code: "he"`, `device: "mobile"`, `load_async_ai_overview: true` | $0.002 per keyword. On mobile, `url` is a Google redirect: take the site from `breadcrumb`. |
| Questions people ask | `serp/google/autocomplete/live/advanced` + the SERP call above with `people_also_ask_click_depth: 3` | Same location and language. Seeds: "<question word> <keyword>" and "<keyword> <question word>" with איך, מה, כמה, למה, מתי, איפה, האם, אילו | Hebrew "People also ask" boxes are rare in Google Israel, so autocomplete is the main source. |
| US comparison | same endpoints | `location_code: 2840`, `language_code: "en"` | |

## What was found (2026-11-16)
Summary and the 29-article plan: `keyword-research-2026-11.md`. Data: `keywords-il.csv` (about 1,600 keywords by cluster), `data/serp-2026-11-16.csv` (22 SERPs), `data/questions-2026-11-16.csv` (autocomplete questions).

## Draft previews on Netlify (no CLI in the cloud session)
Pull requests get an automatic deploy preview (`deploy-preview-<number>--heytadam.netlify.app`). For a preview without a PR: build, zip `dist/`, and POST it as a draft deploy to the Netlify API (the Netlify token is a network secret for `api.netlify.com` in the cloud environment):
```bash
npm run build
(cd dist && zip -qr ../dist.zip .)
SITE_ID=$(curl -sS "https://api.netlify.com/api/v1/sites?filter=all" | python3 -c "import sys,json;print([s['id'] for s in json.load(sys.stdin) if s['name']=='heytadam'][0])")
curl -sS -X POST "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys?draft=true" -H "Content-Type: application/zip" --data-binary @dist.zip
```
The response has `deploy_ssl_url`. Never deploy to production from a branch; merging to `main` deploys production automatically (see CLAUDE.md).
