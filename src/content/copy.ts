/**
 * The site copy. The site is English only (US and Europe); all text lives in copy.en.ts.
 * Components call `useCopy(Astro.url)`, which returns the copy plus the page's language settings.
 * (The Israeli Hebrew site is a separate repository, tanyarofman/tadam-il.)
 */
import { COPY as en } from "./copy.en";

export type Locale = "en";

/** Literal types of copy.en.ts widened to plain strings, numbers and arrays. */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Widen<U>[]
        : { readonly [K in keyof T]: Widen<T[K]> };

export type SiteCopy = Widen<typeof en>;

export const LOCALE = { lang: "en", dir: "ltr", ogLocale: "en_US", home: "/", dateLocale: "en-US", langTag: "en-US" } as const;

export function useCopy(_url?: URL) {
  return { locale: "en" as Locale, copy: en as SiteCopy, ...LOCALE };
}

/** Kept for the callers that build links (`/blog/`, `/privacy`): the site has a single language, so the path is unchanged. */
export const localPath = (_locale: Locale, path: string) => path;
