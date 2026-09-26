import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, localeHref } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { fetchSiteArticles } from "@/lib/articles";
import { NOIMOS_ROUTES } from "@/lib/noimosRoutes";

/**
 * One entry per route, at the bare URL the site serves. The site has a single
 * language, so there is no alternate version to declare and no hreflang set to
 * emit — a self-referential one would only be noise.
 */
const localized = (
  route: string,
  extra: Partial<MetadataRoute.Sitemap[number]> = {},
): MetadataRoute.Sitemap => {
  // A dynamic route ("/tools/[slug]") has no single URL to list, so it is
  // skipped rather than emitted percent-encoded.
  if (route.includes("[")) return [];
  return [{ url: `${SITE_URL}${localeHref(DEFAULT_LOCALE, route)}`, ...extra }];
};

// AI-discoverability baseline — shipped on by default. Real pages come from the
// generated route list (@/lib/noimosRoutes, rewritten from the App Router tree
// by the platform on every build); never invent pages.
//
// Published blog articles are appended automatically from the Noimos CMS when the
// blog is enabled AND the SEO auto-update toggle is on — no manual entry, and a
// new post appears without a rebuild. An article is single-language content, so
// it is listed ONCE at its own canonical URL with no alternates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogBasePath = process.env.NEXT_PUBLIC_BLOG_BASE_PATH;
  const articles = await fetchSiteArticles();
  const posts: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}${a.link}`,
    lastModified: a.publishedAt ?? a.createdAt ?? undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const mountPath = process.env.NEXT_PUBLIC_MOUNT_PATH_PREFIX;
  if (process.env.NEXT_PUBLIC_PATH_MOUNT === "1" && mountPath) {
    const owns = (route: string) => route === mountPath || route.startsWith(`${mountPath}/`);
    const routes = [...new Set([mountPath, ...NOIMOS_ROUTES.filter(owns)])];
    return [
      ...routes.map((route) => ({ url: `${SITE_URL}${route}`, priority: route === mountPath ? 1 : 0.7 })),
      ...posts.filter((post) => owns(new URL(post.url).pathname)),
    ];
  }

  // Path mount (rpi/website-path-mount): this artifact serves ONE namespace on
  // someone else's website. SITE_URL is their origin, so listing the platform
  // site's other routes here would claim URLs that belong to them — pages we do
  // not serve and must not tell Google we own. Only the blog index and its
  // articles, always including the index (this file IS the blog sitemap the
  // owner submits to Search Console, so an empty one is a broken submission,
  // not a frozen one).
  if (process.env.NEXT_PUBLIC_BLOG_MOUNT === "1") {
    if (!blogBasePath) return [];
    return [
      { url: `${SITE_URL}${blogBasePath}`, changeFrequency: "daily", priority: 1 },
      ...posts,
    ];
  }

  const staticPages: MetadataRoute.Sitemap = NOIMOS_ROUTES.flatMap((route) =>
    localized(route, {
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : 0.7,
    }),
  );

  const blogIndex: MetadataRoute.Sitemap =
    blogBasePath && articles.length
      ? localized(blogBasePath, { changeFrequency: "daily", priority: 0.8 })
      : [];

  return [...staticPages, ...blogIndex, ...posts];
}
