"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, isLocale, localeHref, type Locale } from "@/lib/i18n";
import { ROUTE_NAMES } from "@/lib/siteNav";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Deterministic BreadcrumbList JSON-LD (GEO) — shipped ON by default, derived from
// the current route's path segments (no AI needed). The owner's "Breadcrumbs
// structured data" toggle is enforced deterministically: turning it OFF injects
// NEXT_PUBLIC_SEO_BREADCRUMBS=off at build and this renders nothing. Enrich the
// per-crumb names via the `geo` skill only if the segment slug is a poor label.
// Names come from ROUTE_NAMES (src/lib/siteNav.ts); anything not listed there —
// a tool or article slug — is used as-is.
export default function BreadcrumbJsonLd() {
  const pathname = usePathname();
  if (process.env.NEXT_PUBLIC_SEO_BREADCRUMBS === "off") return null;
  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);
  // A locale prefix is not a step in the trail, and a locale home is still a
  // home: "/ja/tools" is Home → Tools, "/ja" alone has no trail at all.
  const locale: Locale = isLocale(segments[0] ?? "") ? (segments.shift() as Locale) : DEFAULT_LOCALE;
  if (segments.length === 0) return null;

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: SITE_NAME,
      item: `${SITE_URL}${localeHref(locale, "/")}`,
    },
    ...segments.map((segment, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: ROUTE_NAMES[segment] ?? segment,
      item: `${SITE_URL}${localeHref(locale, `/${segments.slice(0, i + 1).join("/")}`)}`,
    })),
  ];

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbList).replace(/</g, "\\u003c"),
      }}
    />
  );
}
