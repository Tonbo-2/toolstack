import { ja, type Dictionary } from "./dictionaries/ja";

/**
 * The site's language.
 *
 * 日本語のみ。2026-09-26 にオーナー判断で英語版を削除した（WordPress版が日本語のみで、
 * 2サイトの文言を揃えるため）。日本語は素のURL（`/tools` など）で配信し、以前の
 * 日本語URL `/ja/...` は src/proxy.ts が素のURLへ308で転送する。
 *
 * 言語を増やすときは、ここに LOCALES を足し、src/lib/dictionaries/ に対応する辞書を
 * 用意し（`Dictionary = typeof ja` の型に合わせる）、proxy の転送条件を見直す。
 * ページ自体は `src/app/[locale]/` にあるので、構造の変更は要らない。
 */
export const LOCALES = ["ja"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ja";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** A route param (or anything else) as a usable locale, defaulting rather than throwing. */
export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

export const dictionaries: Record<Locale, Dictionary> = { ja };

/**
 * Tolerant on purpose: client components pass `useParams()` values raw, and a
 * missing or unknown locale must fall back to the site's language, never crash.
 */
export function getDictionary(locale: string = DEFAULT_LOCALE): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[DEFAULT_LOCALE];
}

/** Path for a route in the site's language: localeHref("ja", "/about") → "/about". */
export function localeHref(locale: Locale, path: string): string {
  const p = path === "/" ? "" : path;
  return locale === DEFAULT_LOCALE ? p || "/" : `/${locale}${p}`;
}

/**
 * Per-page canonical for generateMetadata. A single-language site has no second
 * language to point at, so the alternates carry the canonical only — a
 * self-referential hreflang set would just be noise for search engines.
 */
export function localeAlternates(locale: Locale, path: string) {
  return { canonical: localeHref(locale, path) };
}

/** OpenGraph locale code for the site's language. */
export function ogLocale(locale: Locale): string {
  return locale === "ja" ? "ja_JP" : "en_US";
}

/**
 * A reviewed/stamped date in Japanese: "2026年9月20日". Accepts a full ISO
 * timestamp or a bare `YYYY-MM-DD` (which is read as UTC midnight so the day
 * never shifts back one).
 */
export function formatDate(iso: string, locale: Locale): string {
  const value = iso.length <= 10 ? `${iso}T00:00:00Z` : iso;
  return new Date(value).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Fill `{placeholder}` slots in a dictionary string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
