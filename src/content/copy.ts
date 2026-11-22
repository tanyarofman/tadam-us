/**
 * Picks the copy for the page's language.
 * Hebrew is the main site (`/`), English lives under `/en/` for English speakers in Israel.
 * Components call `useCopy(Astro.url)`; the two copy files must keep the same shape (checked by `astro check`).
 */
import { COPY as he } from "./copy.he";
import { COPY as en } from "./copy.en";

export type Locale = "he" | "en";

/** Literal types of copy.he.ts widened, so both languages fit one type. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

export type SiteCopy = Widen<typeof he>;

const copies: Record<Locale, SiteCopy> = { he, en };

export const localeOf = (url: URL): Locale => (/^\/en(\/|$)/.test(url.pathname) ? "en" : "he");

export const LOCALES: Record<Locale, { lang: string; dir: "rtl" | "ltr"; ogLocale: string; hreflang: string; home: string; dateLocale: string; langTag: string }> = {
  he: { lang: "he", dir: "rtl", ogLocale: "he_IL", hreflang: "he", home: "/", dateLocale: "he-IL", langTag: "he-IL" },
  en: { lang: "en", dir: "ltr", ogLocale: "en_IL", hreflang: "en", home: "/en/", dateLocale: "en-GB", langTag: "en" },
};

export function useCopy(url: URL) {
  const locale = localeOf(url);
  return { locale, copy: copies[locale], ...LOCALES[locale] };
}

/** `/privacy` → `/en/privacy` and `/blog/` → `/en/blog/` in English. */
export const localPath = (locale: Locale, path: string) => (locale === "en" ? `/en${path}` : path);

/** The blog collection of each language: same slugs, one Markdown file per article in each. */
export const BLOG_COLLECTION = { he: "blog", en: "blogEn" } as const;

/** The same page in the other language (only call it on pages that exist in both). */
export function otherLanguagePath(url: URL) {
  const path = url.pathname;
  return localeOf(url) === "en" ? path.replace(/^\/en(?=\/|$)/, "") || "/" : `/en${path === "/" ? "/" : path}`;
}
