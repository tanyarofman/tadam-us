# Site review for the US and Europe (Cite-Me AI-search review), 2026-11-24

A review of the English site (today at `/en/`, built from `src/content/copy.en.ts`) for the US and English-speaking Europe. It checks the site against the Cite-Me rules (`content-playbook.md`), what AI search engines cite for our topics, and the keyword research in `keyword-research-us-2026-11.md`.

Each item says whether a fix can simply be made, or whether it **needs Tanya** (a business decision or a real fact that must not be invented).

## Verdict in one paragraph
The English copy is warm and clear, but it was written for English speakers in Israel, not for the US. Search engines and AI assistants can't easily tell what Tadam is or who it's for. The `<title>` and H1 don't use any phrase people search. The home page has no FAQ structured data and no Service description. `llms.txt` describes "a game for events in Israel". The dates are British, the locale is `en_IL`, and the contact route is an Israeli Facebook page. The product phrases themselves ("personalized trivia game", "custom game show") have almost no searches in the US. So the site should describe Tadam in the words people use for the events ("how well do you know the couple", "50th birthday party ideas", "office holiday party games"), and the blog should bring in the traffic.

## 1. What Tadam is: the quotable answer
| Now | Problem | Fix |
|---|---|---|
| `meta.title`: "Tadam! A personal game show for your event" | "personal game show" is not a phrase people search; nothing says trivia, party or guests | "Tadam! Personalized Trivia Game Show for Parties and Events" (59 characters) |
| `meta.description`: "Turn your stories, photos and personal details into a live trivia game show…" | Good, but no events are named and no action | "A live trivia game show built from your guests' stories. Your host on the big screen, everyone plays from their phone. For birthdays, weddings and teams." (≈150) |
| Hero H1: "The moment everyone will remember." | Emotional, but AI engines and Google read the H1 as the page topic | Keep the line visually; add a short visible subtitle or a hidden-from-design but real text line: "A personalized trivia game show for your party, built from your own stories." |
| No one-sentence definition anywhere on the page | AI assistants quote a clear "X is a Y that Z" sentence | Add one near the top and in `llms.txt`: "Tadam! is a personalized live trivia game show for events: we build the questions from your stories and photos, a host runs it on the big screen, and every guest plays from their phone, no app needed." |

## 2. FAQ: in the words people search
The FAQ (`copy.en.ts` → `faq.items`) answers real questions, but in our wording. The research shows what people ask (see the questions data). Proposed changes:
- Keep: "How long does the game take?" (10 to 15 minutes), "What do we need to play?", "Who sees the photos?", "Can friends and family add questions?".
- Reword "Which events is it right for?" to "What events is a trivia game good for?" and list the US events: birthdays and milestone birthdays, rehearsal dinners and weddings, bridal and couples showers, bachelorette parties, anniversaries, retirement and farewell parties, office holiday parties, team building, family reunions, Thanksgiving and holiday gatherings, bar and bat mitzvahs, sweet 16s.
- Add "Is it like Kahoot or Jackbox?" (Jackbox gets 74,000 searches a month; people compare). Answer: the difference is that the questions are about the people in the room and a host runs it. **Needs Tanya** to confirm the wording about competitors.
- Add "Does it work for guests joining remotely?" if true (the team call to action says people joining from home can play). **Needs Tanya.**
- Add "How far ahead should we order?" **Needs Tanya** (real lead time).

## 3. Structured data (technical, can be done)
- The home page has `Organization` and `WebSite` only. Add `FAQPage` from the FAQ items (articles already have it) and a `Service` (name, description, areaServed US/GB/IE/EU, provider = the organization). No prices or reviews until real ones exist.
- `Organization.name` is "טדאם!" with "Tadam!" as the alternate. Swap: "Tadam!" only.
- `inLanguage` "en" to "en-US". `og:locale` `en_IL` to `en_US` (`src/content/copy.ts` `LOCALES`). Dates: `dateLocale` `en-GB` to `en-US`.
- `hreflang` links to the Hebrew twin: remove (English only).

## 4. `llms.txt`
`src/pages/llms.txt.ts` imports the Hebrew copy and describes "events in Israel". Rewrite it in English: the definition sentence, who it's for (the US event list), how it works, the FAQ, links to the home page, the demo and every article. Remove the Hebrew sections.

## 5. `robots.txt`, sitemap, canonical
- `robots.txt` allows everything (good for AI crawlers: GPTBot, ClaudeBot, PerplexityBot, Google-Extended are not blocked). The sitemap line points to heytadam.com, which is the Israeli domain. Must change with the new domain.
- `astro.config.mjs` `site` is heytadam.com, so every canonical URL on tadam-us.netlify.app points to the Israeli site. Today this is harmless (it tells Google the copy is a duplicate), but it has to change before launch. **Needs Tanya:** the domain.
- Until the domain exists, the Netlify site should stay out of Google: add `noindex` on `*.netlify.app` (a header in `netlify.toml` for that host), so the copy doesn't compete with heytadam.com.

## 6. Trust signals for a new market
- **Contact:** every button opens Messenger on the Israeli Facebook page (`src/config/site.ts`). US visitors expect email or a booking form. The lead form exists (`LeadForm.astro`). **Needs Tanya:** a US contact route (email address on the new domain, a separate Facebook/Instagram page, or the form only).
- **About / who we are:** no About section. AI engines and visitors look for who is behind a service. **Needs Tanya:** real facts (founders, where you are, how many games played). Never invented.
- **Proof:** no reviews or real event stories yet. **Needs Tanya:** the first real US-style story or testimonial.
- **Privacy policy** (`src/pages/en/privacy.astro`): short and written for Israel. For the US and EU it should name the data collected (form fields, photos), the processor (Netlify, base44), retention, and how to ask for deletion (GDPR and California rights). **Needs Tanya** (and ideally a legal check); I can draft it.
- **Prices:** hidden (`PRICING.showPrices = false`, currency ₪). Keep hidden until **Tanya** sets USD/EUR prices. Remove "shekels" from `pricing.currencyLabel`.

## 7. Copy that is Israel-specific
- `copy.en.ts` header comment and `nav.langSwitch` ("עברית"): remove the language switch.
- Events strip: "Holiday Toasts" is an Israeli workplace custom (הרמת כוסית). In the US it's the office holiday party. "Class Reunions" and "Farewell Parties" fit the US. Add "Rehearsal Dinners", "Bridal Showers", "Retirement Parties", "Family Reunions", "Milestone Birthdays".
- The custom host example "the aunt from America" reads oddly from the US: "your favorite aunt, the CEO or a beloved character".
- The phone placeholder is already American ("(201) 555-0123"), good.
- Demo: Tom's 13th birthday (a bar mitzvah age). Fine for the US, but a second demo for a wedding or a 40th would match the main US searches better. **Needs Tanya.** The demo links go through heytadam.com (`SITE.tomDemoUrl`); they should go through the new domain's own `/tom-demo` redirect (already in `netlify.toml`).

## 8. Blog
Covered in `keyword-research-us-2026-11.md` (article plan). In short: the blog index title and lead mention "bar and bat mitzvahs" first, and the categories are the Israeli ones. Use the US groups (Birthdays, Weddings and Showers, Companies and Teams, Holidays and Family, Trivia) and lead with weddings and birthdays.

## Order of work
1. **Now, no decisions needed:** English only at the root (Step 4 of the plan), the structured data, `llms.txt`, locale and dates, the events strip, the FAQ rewording, and `noindex` on netlify.app.
2. **When Tanya answers:** contact route, About facts, privacy policy details, competitor wording, prices, a second demo.
3. **When the domain exists:** `site`, `robots.txt`, `site.ts`, `netlify.toml`, Search Console, remove `noindex`.
