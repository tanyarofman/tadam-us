# Content playbook: writing articles that AI search cites

Source: a playbook Tanya shared on 2026-11-16 (AI Search Kickstarter, "AI Content Writing Playbook" and the "Cite-Me prompt"). Below: its rules, adapted to Tadam, and how we run each step here.

## The five rules
1. **Questions as headings.** H2/H3 are the exact questions people type ("כמה זמן צריכה להימשך הרמת כוסית לחג?"), not topic labels ("תזמון").
2. **Back every claim with a real source.** Link a high-quality source on the phrase itself, in the paragraph where the claim is. "Studies show…" with no link is not enough.
3. **Add first-hand experience.** A real event, a real result, a real quote. AI can't copy it, and it makes the article different from competitors.
4. **One or two tables.** AI search engines pick up structured tables, and they break up text.
5. **Internal links.** A post without internal links is a room without doors.

## The rule of one (per article)
One question per H2 · one answer in 2 sentences under it · one source per claim, inline on the phrase · one table · one first-hand story.

## Common mistakes
- Rewriting existing content without adding anything new. Search engines don't reward the same thing said again.
- Chasing a word count. Length follows the topic.
- Overloaded prompts. Good context beats 50 instructions and personas.

## How we run it for Tadam

| Playbook step | Our version |
|---|---|
| DataWise "People also ask" (depth 3) | DataForSEO: `python3 tools/seo/research.py questions --kw "<keyword>"`. Hebrew PAA is rare in Google Israel, so autocomplete with question words (איך, מה, כמה, האם…) is the main source. |
| Cite-Me prompt, phase 1 (research: top pages, real questions, gaps, sources) | `research.py serp` for the top pages and AI Overview sources, `questions` for the questions, web search for sources. Note the gaps (example: nobody answers "האם משלמים על יום גיבוש"). |
| Phase 2 (H1, question H2s, where the table/FAQ/experience go) | Planned in the conversation, approved by Tanya before writing. |
| Ask for first-hand experience | Ask Tanya. Until she answers, put a hidden marker where the story goes: `[//]: # "חוויה אישית: ..."` (Markdown comment, never reaches the HTML). **Never invent one.** |
| Phase 3 draft in ChatGPT Canvas | Written directly as `src/content/blog/<slug>.md`, reviewed in the PR's Netlify preview. |
| Capsule technique | Under each H2: a 2-sentence answer (max 50 words), then 2 to 4 paragraphs or a list. |
| Inline links, no sources list | Markdown links on the phrase. External links open in a new tab automatically (`src/scripts/blog.ts`). Log every source in `docs/seo/sources.md`. |
| FAQ: 4 questions, 2-sentence answers | `faq:` in the frontmatter. Rendered at the bottom and output as `FAQPage` structured data. |
| SEO title ≤ 60, meta description ≤ 155 | `seoTitle` and `description` in the frontmatter. The build fails if they're longer (`src/content.config.ts`). |
| 3 to 5 internal links | Other articles, `/#demo` (opens the demo modal), `/`. |
| Feature image 16:9, WebP | Not used for now (Tanya's choice, 2026-11-16). If added later: generic illustration in the site's blue/yellow style, no real people (brief rule), convert PNG to WebP. |
| WordPress | Astro Markdown; the article template is `src/pages/blog/[slug].astro`. |

## Tadam's own rules on top (from CLAUDE.md and the brief)
- Hebrew, RTL, parents and teams addressed as אתם, no em-dashes or en-dashes.
- Never a real celebrity, athlete or recognizable character; the host is always generic.
- No prices in articles (they live only in `src/config/pricing.ts`).
- One honest Tadam section near the end, not a sales pitch in every paragraph.

## The Cite-Me prompt (original, for use in ChatGPT / Claude / Gemini)
Kept here for reference, as shared. Replace TOPIC and AUDIENCE.

```
You are writing one piece of citation-ready content for AI search engines (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews).

TOPIC: [your topic]
AUDIENCE: [who reads this]
GOAL: get cited as the source AI engines pull from.

PHASE 1 (RESEARCH, do this first, do not skip):
- Search the web for the top 5-10 ranking pages on this topic.
- Pull the real user questions: People Also Ask, Reddit threads, forum posts.
- List 3 gaps where existing content is shallow, outdated, or unsourced.
- List 3-5 high-quality sources I should cite (studies, .gov, .edu, industry authority).
  For each source: include the FULL URL, the publication name, and the year.
Report back: question list, gap analysis, source list. Do NOT proceed to Phase 2 yet.

PHASE 2 (STRUCTURE + PERSONAL EXPERIENCE, wait for my approval):
- Propose the H1.
- Propose every H2 / H3 as the exact question a user would type.
- Under each heading, write one line on what the 2-sentence capsule will say.
- For EACH section, note which Phase 1 source(s) will be inline-linked there.
- Mark where the table goes, the FAQ block, and the spots that need my personal example.
- Then ASK ME: "Do you have any first-hand experience, client stories, screenshots, or measured results to weave in? Tell me which sections to embed them in."
STOP. Wait for my "approved" + my personal experience details before writing the draft.

PHASE 3 (DRAFT, in Canvas / Artifact):
- Capsule Technique: 2-sentence answer (max 50 words) under each heading, then 2-4 paragraphs of detail.
- CRITICAL: every source from Phase 1 is inline-linked on the exact phrase in the body.
  No Sources / References list at the end. No numbered footnotes.
- Include the Phase 2 table. Weave my personal experience exactly where I asked.
- Suggest 3-5 internal links. End with FAQ: 4 questions, each answered in 2 sentences.

PHASE 4 (PUBLISH PACKAGE):
1. SEO title tag (max 60 chars, primary keyword + benefit hook).
2. Meta description (max 155 chars, primary keyword + action verb).
3. Feature image prompt, 16:9, no stock-photo cliches.

FORBIDDEN: padding, AI cliches, generic claims without sources, skipping a phase or the experience question, a sources block at the end, numbered footnotes.
```
