import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Blog articles: one Markdown file per article in src/content/blog/.
 * Copy rules (see CLAUDE.md): Hebrew, parents addressed as אתם, no em-dashes, generic host only.
 * The keyword plan behind each article lives in docs/seo/.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    /** The H1. Contains the target keyword; a question where it reads naturally. */
    title: z.string(),
    /** The <title> tag when the H1 is too long: 60 characters max, keyword first. */
    seoTitle: z.string().max(60).optional(),
    /** Meta description: 155 characters max, keyword + an action. */
    description: z.string().max(155),
    /** The search phrase this article is written for (docs/seo/keyword-research-2026-11.md). */
    targetKeyword: z.string(),
    /** Short direct answer shown at the top. This is what Google AI Overviews and chatbots quote. */
    answer: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    /** Grouping on the blog index. */
    category: z.enum(["בר ובת מצווה", "חגים ומשפחה", "חברות וצוותים", "ימי הולדת", "חתונות ואירועים", "טריוויה"]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
