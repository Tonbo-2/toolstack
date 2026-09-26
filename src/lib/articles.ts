/**
 * Published blog articles for this site, fetched live from the Noimos CMS.
 *
 * The GEO baseline — `sitemap.ts` and `llms.txt/route.ts` — lists these so a new
 * blog post is discoverable the moment it is published: no manual sitemap edit and
 * no rebuild (the routes revalidate on their own). Gated on the SEO auto-update
 * toggle (`NEXT_PUBLIC_SEO_AUTO_UPDATE`, default off). Returns `[]` when the blog is
 * off or unwired (`NEXT_PUBLIC_CMS_API_BASE_URL` / `NEXT_PUBLIC_WEBSITE_ID` are
 * injected only while the blog is enabled), so a blog-less site ships just its
 * static pages. Server-only + best-effort: any failure degrades to `[]`.
 *
 * Intentionally self-contained — NOT the blog skill's `src/lib/blog.ts`, which is
 * scaffolded on demand — so the always-present SEO baseline never depends on the
 * blog pages having been built.
 */
export interface SiteArticle {
  title: string;
  /** Base-path-relative, e.g. "/blog/my-post". */
  link: string;
  /** Short summary (present in the list response) — used by llms-full.txt. */
  excerpt?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
}

export async function fetchSiteArticles(): Promise<SiteArticle[]> {
  const base = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;
  const websiteId = process.env.NEXT_PUBLIC_WEBSITE_ID;
  if (!base || !websiteId) return [];
  // Auto-update gate (SEO tab): only when ON do the discovery files (sitemap /
  // llms.txt / llms-full.txt) live-list published articles. OFF (or unset by an
  // older build) freezes them to the static/core pages.
  //
  // A path-mount artifact is exempt: its sitemap has no static/core pages to
  // freeze to (it lists only the blog), so honoring the toggle there would ship
  // an EMPTY sitemap to the URL the owner submits to Search Console rather than
  // a frozen one. The toggle keeps its meaning on the normal site artifact.
  const mounted = process.env.NEXT_PUBLIC_BLOG_MOUNT === "1";
  if (!mounted && process.env.NEXT_PUBLIC_SEO_AUTO_UPDATE !== "1") return [];
  const variant = process.env.BLOG_VARIANT || "prod";
  const token = process.env.BLOG_PREVIEW_TOKEN;
  const headers = token ? { "x-wb-preview-token": token } : undefined;

  const out: SiteArticle[] = [];
  try {
    // Page through the cms-api (100/page cap) up to a safety bound so every
    // published post reaches the sitemap even for a large blog.
    for (let page = 1; page <= 20; page++) {
      const res = await fetch(
        `${base}/cms-api/website/${websiteId}/articles?page=${page}&limit=100&variant=${variant}`,
        // Timeout cap: this runs during `next build` prerender (sitemap/rss) —
        // a slow CMS response must degrade to [] instead of stalling the build.
        // 60s, matching the cms-api's own cache: together they are the two
        // halves of the stated freshness guarantee — a publish, unpublish, trash
        // or rename is visible within 2 minutes (rpi/website-path-mount 6.7,
        // Decision 30). A longer window here would make the sitemap the slowest
        // surface to notice a change, which is the one Google reads.
        { headers, next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) },
      );
      if (!res.ok) break;
      const data = (await res.json()) as { articles?: SiteArticle[]; total?: number };
      const batch = Array.isArray(data.articles) ? data.articles : [];
      out.push(...batch);
      if (batch.length < 100 || out.length >= (data.total ?? out.length)) break;
    }
  } catch {
    // best-effort — the SEO files still ship their static pages
  }
  return out;
}
