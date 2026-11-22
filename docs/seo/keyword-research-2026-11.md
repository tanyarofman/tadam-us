# Tadam blog: keyword research and content plan (Israel, Hebrew)

Researched 2026-11-16 with the DataForSEO API: Google Ads search volumes (Israel `2376`, US `2840`),
DataForSEO Labs keyword suggestions (Hebrew), and 22 live Google Israel mobile SERPs
(organic results, People Also Ask, AI Overviews). Full keyword list: [`keywords-il.csv`](./keywords-il.csv)
(volume = average monthly Google searches; kd = DataForSEO keyword difficulty 0 to 100; cpc in USD).

How to write each article (the "AI-rewarded content" rules):
- **Question headings.** H1 contains the target keyword (a question where it reads naturally). Every H2 is the exact question people type (take them from autocomplete / People also ask, see below).
- **Capsule answer.** Right under each H2: a 2-sentence answer (max 50 words), then the details. The frontmatter `answer` is the short answer to the whole article, shown in a box at the top.
- **Inline sources.** Every factual claim links to a high-quality source on the phrase itself, in the same paragraph. No "sources" list at the end, no footnotes. Never link a source that wasn't checked.
- **First-hand experience.** At least one real story per article (a real event, a real result). Until it arrives, a hidden `<!-- חוויה אישית: ... -->` marker shows where it goes. Never invent one.
- **One or two tables.**
- **3 to 5 internal links**: other articles, `/#demo` (opens the demo modal), the home page.
- **FAQ**: 4 questions in the frontmatter, 2-sentence answers (rendered + `FAQPage` structured data).
- **Title tag** (`seoTitle`) 60 characters max, keyword first; **description** 155 max. The build fails if they're longer.
- Hebrew, parents/teams addressed as אתם, no em-dashes or en-dashes, generic host only, no real people. No prices in articles (they live only in `src/config/pricing.ts`).
- No padding: length follows the topic, not a word count.

### Questions people ask (DataForSEO autocomplete, Google Israel, 2026-11-16)
Google Israel rarely shows "People also ask" in Hebrew, so autocomplete is the main question source.
- יום גיבוש: האם משלמים על יום גיבוש · האם חובה להגיע · מס הכנסה · מע״מ · הוצאה מוכרת · בחורף · לצוות קטן
- חידון חנוכה: עם תשובות · לילדים / לכיתה · מאתגר · מצחיק · אינטראקטיבי / אונליין / משחק · הוא והיא
- אטרקציות לבר מצווה: באולם · בבית

## What the data says
1. **Volumes are small but the competition is almost zero.** Keyword difficulty is 0 to 15 on nearly every relevant term. Page 1 today is small vendor blogs, forums and the Karamel portal. A new site with good articles can rank.
2. **People don't search "trivia for a bar mitzvah"** (zero volume). They search **"אטרקציות ל…"** and **"רעיונות ל…"**. So we enter through those words and pitch the game inside the article.
3. **Google shows an AI Overview on 19 of 22 searches.** Those overviews quote list-style articles from karamel.co.il, pop-star.co.il and show-events.co.il. None of them mention a personalized trivia game. That's the gap: if our list articles are the clearest answer, the AI will quote us.
4. Real need seen in a forum result that ranks: "מחפשת לתת תוכן בבר מצווה. לא מקום אבל תוכן". That is exactly Tadam's pitch.

### Key keyword clusters (monthly searches, Israel)
| Cluster | Main terms (volume) |
|---|---|
| Bar/bat mitzvah attractions | אטרקציות למסיבת בר מצווה 390 · אטרקציות לבת מצווה 390 · אטרקציות לאירוע בת מצווה 390 · אטרקציות לבר מצווה 320 · אטרקציות לאירוע בר מצווה 320 |
| Bar/bat mitzvah ideas | רעיונות למסיבת בת מצווה 590 · רעיונות לבת מצווה 480 · רעיונות לחגיגת בת מצווה 480 · רעיונות לחגיגת בר מצווה 260 · רעיונות לבר מצווה 210 · רעיונות למסיבת בת מצווה בבית 140 |
| "הפעלה" (highest buying intent, CPC up to ₪4) | הפעלה לבת מצווה 90 · הפעלות לבת מצווה 90 · הפעלה לבר מצווה 50 · הפעלה ליום הולדת 390 |
| The kid's story (clip/slideshow) | קליפ בר מצווה 480 · קליפ בת מצווה 2,400 · מצגת בת מצווה 210 · מצגת בר מצווה 170 · סרטון בת/בר מצווה 170/140 |
| Blessings (big traffic, top of funnel) | ברכה לבר מצווה 3,600 · ברכה לבת מצווה 2,400 · ברכה לנכד בר מצווה 3,600 · ברכה לאחות בת מצווה 2,400 |
| Trivia / quiz | טריוויה 9,900 · טריוויה ידע כללי 1,600 · שאלות טריוויה 1,300 · חידון טריוויה 880 · משחק טריוויה 590 · חידון קהוט 260 · חידון חברות 720 |
| Holiday quizzes (seasonal) | חידון חנוכה 1,300 · חידון לחנוכה 880 · חידון חנוכה למבוגרים 390 · חידון חנוכה מצחיק 320 · חידון פורים 720 · חידון פסח 720 |
| Adult birthdays | רעיונות למסיבת יום הולדת 880 · רעיונות למשחקי יום הולדת 880 · רעיונות להפתעת יום הולדת 880 · יום הולדת 50/60 390 each · רעיונות למסיבת יום הולדת למבוגרים 260 |
| Weddings / parties | אטרקציות לחתונות 720 · אטרקציות לחתונה 590 · אטרקציות לאירועים 480 · הפעלה למסיבת רווקות/רווקים 70 each |
| **Companies / hi-tech** (CPC ₪4 to ₪10, about 4× bar mitzvah) | יום גיבוש לעובדים 1,000 · יום גיבוש לצוות עובדים 1,000 · יום גיבוש לצוות קטן 320 · פעילות/פעילויות גיבוש לעובדים 260+260 · אירוע/אירועי חברה 260+260 · משחקי גיבוש 260 + קלילים 210 + מצחיקים 110 · ערב גיבוש 170 + לעובדים 90 + מצחיק 90 · יום כיף לעובדים 170 · ערב צוות 110 · אונבורדינג 110 · הרמת כוסית 590 + לפסח 110 + לראש השנה 90 · אטרקציות לאירועי חברה 90 · יום גיבוש בתקציב נמוך 110 |
| Schools, community, seniors | מסיבת סיום 210 · מסיבת סיום כיתה ו 90 · פגישת מחזור 140 · פעילות לגיל השלישי 90 · פעילויות גיבוש לנוער 90 |
| English, US market (for later) | team building activities for work 12,100 · 50th birthday party ideas 8,100 · retirement party ideas 5,400 · icebreaker games for work 2,900 · family reunion games 2,900 · virtual team building games 1,000 · office holiday party games 880 · bar/bat mitzvah party ideas 480 each · kahoot alternative 210 · custom trivia game 170. Much bigger, but competition is HIGH there. |

**Company takeaway:** company searches are fewer than family ones but each click is worth 3 to 5 times more, and a company pays more per event. Nobody ranking today offers "a trivia game built from your own team" (page 1 is cooking workshops, nature days and escape rooms). Searches for "טריוויה לעובדים" or "חידון לצוות" show no volume yet, so we enter through "יום גיבוש", "ערב צוות", "הרמת כוסית" and "משחקי גיבוש".

## The blog plan: 29 articles in 6 groups

Status: ✅ = written (in `src/content/blog/`). Everything else is planned.
Each article: Hebrew, addresses parents as אתם, no em-dashes, generic host only, a short direct answer at the top (that is what AI Overviews quote), numbered list, FAQ block at the bottom, one honest mention of Tadam plus a demo CTA. Order = publishing order.

**Now (timely)**
1. ✅ **חידון חנוכה למשפחה: 40 שאלות מצחיקות + איך הופכים אותו למשחק** · חידון חנוכה / לחנוכה / למבוגרים / מצחיק (about 2,900 combined). Hanukkah starts 4 Dec 2026, so this goes first. Family gatherings = Tadam's audience.

**Group A: bar/bat mitzvah (core, highest value)**
2. ✅ **אטרקציות לבר מצווה: 25 רעיונות שהאורחים באמת יזכרו** · about 1,400 combined
3. **אטרקציות לבת מצווה: מה עובד לכל הגילאים** · about 1,200 combined
4. **רעיונות למסיבת בת מצווה (גם בבית)** · about 1,700 combined
5. **רעיונות לבר מצווה שלא דורשים אולם גדול** · about 700 combined
6. **הפעלה לבר ובת מצווה: איך בוחרים הפעלה שמחברת את סבתא לחברים מהכיתה** · highest buying intent
7. **קליפ, מצגת או משחק? 3 דרכים לספר את הסיפור של חתן/כלת השמחה** · clip/slideshow searches; positions Tadam next to the clip, not against it
8. **שאלות על חתן/כלת השמחה: 60 שאלות לחידון אישי** · tiny volume, perfect fit, strong for ChatGPT answers
9. **ברכה לבר/בת מצווה: איך כותבים + 15 דוגמאות** · 6,000+ combined; top of funnel, CTA "turn the memories into questions in the game"

**Group B: trivia know-how (topical authority + AI citations)**
10. **איך מכינים משחק טריוויה לאירוע: המדריך המלא** · משחק/חידון טריוויה about 2,000
11. **קהוט באירוע משפחתי? מה עובד ומה לא (השוואה)** · חידון קהוט; comparison pages get quoted by AI
12. ✅ **100 שאלות טריוויה ידע כללי עם תשובות** · about 3,000; pure traffic, link to articles 10 and 8
13. **חידון זוגי וחידון חברות: שאלות מוכנות** · about 800

**Group C: adult birthdays**
14. **רעיונות למסיבת יום הולדת למבוגרים (כולל משחקים)** · about 2,000 combined
15. **יום הולדת 40, 50, 60: איך חוגגים כשכולם מכירים את החוגג/ת** · about 1,300
16. **רעיונות להפתעת יום הולדת** · 880

**Group D: weddings and events**
17. **אטרקציות לחתונה שלא דורשות רחבה (לחינה, לשישי, לאירוע קטן)** · about 1,300
18. **אטרקציות לאירועים למבוגרים: המדריך** · hub page, links to everything (about 1,000)

**Group E: companies and hi-tech (new, high value per click)**
19. ✅ **רעיונות ליום גיבוש לעובדים (גם לצוות קטן ובתקציב נמוך)** · about 2,700 combined; the pillar page for companies
20. **ערב צוות / ערב גיבוש: 15 רעיונות שלא דורשים לצאת מהמשרד** · about 600
21. **משחקי גיבוש לעובדים: קלילים, מצחיקים, ובלי מביכות** · about 600
22. ✅ **הרמת כוסית לחג במשרד: איך עושים אותה שווה (ראש השנה, חנוכה, פסח)** · about 800 + seasonal; publish 3 to 4 weeks before each holiday
23. **מסיבת פרידה או פרישה לעובד/ת: רעיונות + משחק על החוגג/ת** · small Hebrew volume but direct fit (in the US: 5,400)
24. **אונבורדינג שעובד: משחק היכרות לעובדים חדשים** · 110 + קליטת עובדים חדשים 70
25. **אטרקציות לאירועי חברה: מה באמת מחבר אנשים** · 90 to 260, highest CPC
26. **גיבוש לצוות היברידי ומרוחק (מהטלפון)** · zero Hebrew volume today, but strong for hi-tech teams and AI answers; mirrors the US "virtual team building games" (1,000)

**Group F: schools, community, reunions (smaller, seasonal)**
27. **מסיבת סיום כיתה ו / י"ב: רעיונות ומשחק על השנה שעברה** · about 400 combined, publish in April
28. **פגישת מחזור: איך מחזירים את כולם 20 שנה אחורה** · 140
29. **פעילות לגיל השלישי: חידון זיכרונות** · 90; also opens retirement homes and community centers as buyers

Later, by season: Purim quiz (Feb), Passover family quiz (Mar/Apr).

## "Think global": what Tadam can offer organizations
The same engine (stories and photos turned into a live game on the big screen + phones) fits these organization moments. Each one gets an article, and the first few should get a business landing page:
- **Holiday toasts** (Rosh Hashanah, Hanukkah, Passover): a game built from the team's year.
- **Farewell / retirement**: a game about the person leaving, from colleagues' memories.
- **Onboarding**: "who on the team…?" quiz so new hires learn names and stories.
- **Team-building and hybrid teams**: plays on phones, so remote people join too.
- **Company milestones**: 10-year anniversary, exit, product launch, year-end.
- **Family day / customer events / conferences**: branded trivia about the company or the product.
- **Schools, youth movements, community centers, retirement homes, reunions.**
- **English version for global teams and the US/UK Jewish market** (bar/bat mitzvah ideas, retirement party ideas, team building). Bigger volumes, harder competition, and the brief says Hebrew only, so this is a later decision for Tanya.

**Needs Tanya's decision before building:** a separate business page (`/לחברות` or `/business`) with its own copy and pricing. The home page story order stays untouched. Corporate articles can be written before that page exists; until then they point to the demo + WhatsApp CTA.

## Getting cited by Google AI and ChatGPT
- An answer box at the top of each article (2 to 3 sentences that answer the search directly), then a list, then FAQs.
- `BlogPosting` + `FAQPage` structured data on every article; `llms.txt` at the site root describing Tadam.
- AI Overviews quote directories: get Tadam listed on karamel.co.il and mesibonet.co.il (free listings first; **paid listing needs Tanya's OK**). Also answer the Facebook/forum threads that rank (for example "תוכן לבר מצווה").
- **Custom domain matters.** Articles on `tadam-game.netlify.app` build authority on a subdomain we'd later leave. Connect the real domain before publishing (config is already marked TODO in `astro.config.mjs`).


## Re-checking results
Re-run the same SERP check for the target keywords 4 and 8 weeks after publishing on the real domain
(about $0.05 per run on DataForSEO), and submit `sitemap-index.xml` in Google Search Console.
