import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * Serves the site from `src/app/[locale]/` at the bare URLs.
 *
 * Every page lives under `src/app/[locale]/`, so `/tools` is not a route by
 * itself — this rewrite is what makes `/tools` answer with the tools page while
 * the address bar stays unprefixed (no redirect, no visible `/ja`).
 *
 * Rewrite-only on purpose: the rewritten request re-enters this file, so a
 * redirect from `/ja/...` to the bare URL would bounce back and forth forever if
 * it also fired on the rewrite. INTERNAL_PARAM is what tells the two apart — it
 * is set on the rewritten URL below and checked before anything else, so the
 * redirect can never see its own output. (`x-middleware-rewrite` is Next's own
 * marker on the same internal request; either one is enough.)
 *
 * The browser never sees the parameter: a rewrite keeps the address bar at the
 * requested URL, so analytics and links stay clean.
 *
 * `/go/...` (affiliate redirects) and `/api/...` stay outside the locale tree
 * and are excluded, as are metadata routes (any path with a file extension:
 * sitemap.xml, robots.txt, llms.txt, the blog RSS feed).
 */
const INTERNAL_PARAM = "__sp_internal";

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // The internal rewrite below — never redirect this one (see the note above).
  if (searchParams.has(INTERNAL_PARAM) || request.headers.get("x-middleware-rewrite")) {
    return NextResponse.next();
  }

  // Until 2026-09-26 the site served English at the bare URLs and Japanese under
  // `/ja/...`. English is gone and Japanese now lives at the bare URL, so the old
  // Japanese addresses move there permanently (308): the links and the search
  // rankings those pages earned come along instead of 404ing.
  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice("/ja".length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  url.searchParams.set(INTERNAL_PARAM, "1");
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/((?!api|go|_next|.*\\..*).*)"],
};
