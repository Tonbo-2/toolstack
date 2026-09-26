/**
 * Shared site identity (origin + name + description).
 *
 * `SITE_URL` is injected by the platform at build time via
 * `NEXT_PUBLIC_SITE_URL` (the live origin); it falls back to
 * `https://example.com` only in local/preview builds with no origin.
 * `SITE_NAME` / `SITE_DESCRIPTION` come from the owner's Manage → SEO & GEO panel
 * (the site `name` + `metaDescription` DB fields, injected as
 * `NEXT_PUBLIC_META_TITLE` / `NEXT_PUBLIC_META_DESCRIPTION` — the builder agent
 * sets them via `set_seo_meta`), falling back to this site's own brand entries so
 * a preview build never renders a placeholder name in the footer or <title>.
 * `name` is the single site title: it drives the page <title> AND the JSON-LD
 * entity name. The GEO/SEO baseline — `robots.ts`, `sitemap.ts`,
 * `llms.txt/route.ts`, and the `siteJsonLd` in `StructuredData.tsx` — all import
 * from here so the identity has a single source of truth.
 */
import { BRAND } from "@/lib/brand";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(
  /\/+$/,
  "",
);

export const SITE_NAME = process.env.NEXT_PUBLIC_META_TITLE ?? BRAND.name;

export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_META_DESCRIPTION ?? BRAND.blurb;

/**
 * BCP-47 language tag for the site's primary content — drives `<html lang>` and
 * JSON-LD `inLanguage` from one source of truth. Set `NEXT_PUBLIC_SITE_LANG`
 * (or change this default) to the site's ACTUAL content language; a non-Japanese
 * site declaring itself `ja` harms SEO hreflang and screen-reader pronunciation.
 */
export const SITE_LANG = process.env.NEXT_PUBLIC_SITE_LANG ?? "ja";
