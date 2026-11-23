# Risks and open items

| # | Risk | What could happen | Mitigation | Owner |
|---|---|---|---|---|
| 1 | Paddle sees a human service | The game is reviewed and produced by the team after payment. Paddle turns down standalone human services | Self-serve wording everywhere. The wizard on the site. An honest "24 hours" delivery promise | Tanya |
| 2 | Generative AI scrutiny | Paddle looks hard at AI products, and restricts deepfakes and voice impersonation | Ready-made invented hosts only. AI use explained plainly in the application | Tanya |
| 3 | Children's data (GDPR, COPPA) | Photos and stories of minors. Fines are high | Buyers 18+, consent in the terms, 30-day deletion, processors listed. **Lawyer review before launch** | Tanya + lawyer |
| 4 | 30 days vs "a keepsake" | Buyers may expect to replay the game later | Say "30 days" in pricing, the FAQ and the checkout. Option: "30 days after the event" if the wizard collects the date | Tanya |
| 5 | Refund after the party | A buyer plays the game and then asks for a refund within 14 days. Paddle allows no exclusions | Accept it as a cost of business. Watch the refund rate | Tanya |
| 6 | Two sites, one brand | heytadam.com (ILS, done for you) and us.heytadam.com (USD, self-serve). A reviewer may look at both | The application explains the Israeli site is separate and local. us.heytadam.com stands on its own | Tanya |
| 7 | Trademark | Someone else owns a similar mark in the US or EU (see below) | Official search before spending on US/EU marketing | Tanya / lawyer |
| 8 | Base44 limits | No webhook, API or custom-domain support for the paid hand-off | Ilan checks this. Fallback: move the backend to Supabase | Ilan |
| 9 | Wizard wording | The English wizard says something the site doesn't (a real-person host, "keep forever") and fails domain review | Review the wizard against `site-copy.md` before applying | Tanya |
| 10 | AI vendor terms | A vendor may keep or train on uploaded content, which would make the privacy promise untrue | Ilan lists the vendors. Check each one's data terms; turn off training and retention where possible | Ilan |
| 11 | Vendor regions | Data processed in the US needs a transfer basis for EU users | DPF certification or SCCs per vendor. Listed in the privacy policy | Ilan |

## Trademark check (2026-11-23, preliminary)

The official registries (USPTO, EUIPO, TMview) are blocked from the environment this was done in, so this is a **web search only, not a clearance**.

- **No "TADAM" word mark** turned up for games or apps in US records.
- **TADADAA**: registered in the US, Class 9 (downloadable game and music-learning apps), owned by a Finnish company ([Justia](https://trademarks.justia.com/902/37/tadadaa-90237574.html)). **This is the one to watch**: similar sound, overlapping class, and an EU owner.
- **TADA GAMING**: US application filed in 2022, status pending in the record seen ([Justia](https://trademarks.justia.com/976/86/tada-97686187.html)).
- **TADAH GAMES** (abandoned 2018), **TADAAA!** (abandoned), **TADRAM** (abandoned 2015): no current conflict.

**Next step:** search "TADAM" yourself on [USPTO Trademark Search](https://tmsearch.uspto.gov/) and [EUIPO eSearch / TMview](https://www.tmdn.org/tmview/) (classes 9, 28 and 41), or ask a trademark lawyer for a clearance before investing in US/EU marketing.
