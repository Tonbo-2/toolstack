"use client";

import { usePathname } from "next/navigation";
import { BRAND } from "@/lib/brand";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n";
import { ROUTE_NAMES } from "@/lib/siteNav";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// AI-discoverability baseline (GEO) — one JSON-LD @graph with Organization +
// WebSite + WebPage, shipped ON by default. This is the single home for the site
// @graph; enrich via the `geo` skill: add real `logo`/`sameAs` and type-specific
// nodes (Service, Product, FAQPage, Article…). Keep `inLanguage` matching the
// content. The owner's "JSON-LD structured data" toggle is enforced
// deterministically: turning it OFF injects NEXT_PUBLIC_SEO_JSONLD=off at build and
// this renders nothing (no AI edit needed).
export default function StructuredData() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_SEO_JSONLD === "off") return null;
  if (!pathname) return null;

  const siteUrl = SITE_URL.replace(/\/+$/, "");
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  // The locale is a URL segment, not a page: "/ja/tools" is the tools page, and
  // it declares its own language rather than being named after "ja".
  const segments = normalizedPath.split("/").filter(Boolean);
  const locale: Locale = isLocale(segments[0] ?? "") ? (segments.shift() as Locale) : DEFAULT_LOCALE;
  const pagePath = segments.length ? `/${segments.join("/")}` : "/";
  const pageUrl = pagePath === "/" ? `${siteUrl}/` : `${siteUrl}${pagePath}`;
  const lastSegment = segments.at(-1);
  const pageName = lastSegment
    ? `${ROUTE_NAMES[lastSegment] ?? lastSegment} | ${SITE_NAME}`
    : SITE_NAME;
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        description: SITE_DESCRIPTION,
        logo: BRAND.iconUrl,
        name: SITE_NAME,
        url: `${siteUrl}/`,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        description: SITE_DESCRIPTION,
        inLanguage: locale,
        name: SITE_NAME,
        publisher: { "@id": `${siteUrl}/#organization` },
        url: `${siteUrl}/`,
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        inLanguage: locale,
        isPartOf: { "@id": `${siteUrl}/#website` },
        name: pageName,
        url: pageUrl,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(siteJsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
