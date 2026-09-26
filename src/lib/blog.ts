import { formatDate, type Locale } from "@/lib/i18n";

/**
 * Live blog layer — articles are authored in Noimos and served by the platform
 * cms-api at request time (a publish appears without a rebuild). Nothing about
 * an article is stored in this repo.
 *
 * An article is a SINGLE language (the CMS holds one body per article), so it is
 * always listed once at its own canonical URL — the chrome around it follows the
 * locale of the URL it is read at.
 */

const BASE = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || "";
const WID = process.env.NEXT_PUBLIC_WEBSITE_ID || "";
// Server-only — selects which articles this deploy serves. Read at request/ISR
// time (never inline it into a client component). preview deploy → "preview".
const VARIANT = process.env.BLOG_VARIANT || "prod";
// Server-only secret the preview deploy presents so the cms-api will serve
// preview-only drafts; absent on prod. NEVER expose to the client.
const PREVIEW_TOKEN = process.env.BLOG_PREVIEW_TOKEN || "";
const cmsHeaders: HeadersInit | undefined = PREVIEW_TOKEN
  ? { "x-wb-preview-token": PREVIEW_TOKEN }
  : undefined;
const enabled = () => Boolean(BASE && WID);
const url = (p: string) => `${BASE}/cms-api/website/${WID}${p}`;

export type Article = {
  websiteArticleId: string;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string | null;
  heroImageUrl?: string | null;
  keywords?: string[];
  seoMetaDesc?: string | null;
  link: string;
  createdAt: string;
  publishedAt?: string | null;
  updatedAt?: string;
};

export async function fetchArticles(
  page = 1,
  limit = 20,
): Promise<{ articles: Article[]; total: number; page: number; limit: number }> {
  if (!enabled()) return { articles: [], total: 0, page, limit };
  try {
    // 5s timeout: these fetches also run during prerender — a slow CMS response
    // must degrade to an empty list instead of stalling the build.
    const res = await fetch(url(`/articles?page=${page}&limit=${limit}&variant=${VARIANT}`), {
      headers: cmsHeaders,
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { articles: [], total: 0, page, limit };
    return res.json();
  } catch {
    return { articles: [], total: 0, page, limit };
  }
}

/**
 * One of three outcomes, because a slug that no longer serves an article is not
 * automatically a 404: it may have been RENAMED, and every link already
 * published to the old URL has to keep working.
 */
export type ArticleResult =
  | { kind: "article"; article: Article }
  | { kind: "redirect"; to: string }
  | { kind: "missing" };

export async function fetchArticle(slug: string): Promise<ArticleResult> {
  if (!enabled()) return { kind: "missing" };
  try {
    // params.slug arrives ALREADY percent-encoded on the production runtime but
    // decoded on `next dev` — decode first so a non-ASCII slug is never
    // double-encoded into a cms-api 404.
    let decoded = slug;
    try {
      decoded = decodeURIComponent(slug);
    } catch {
      /* keep raw */
    }
    const res = await fetch(url(`/articles/${encodeURIComponent(decoded)}?variant=${VARIANT}`), {
      headers: cmsHeaders,
      // no-store deliberately: the cms-api's 60s cache + write-time bust IS the
      // freshness bound, and a cached detail kept a renamed article's old URL
      // answering 200 instead of its redirect.
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const to = data && typeof data.redirectTo === "string" ? data.redirectTo : null;
      return to ? { kind: "redirect", to } : { kind: "missing" };
    }
    return { kind: "article", article: data.article };
  } catch {
    return { kind: "missing" };
  }
}

/** Display date = publishedAt ?? createdAt (never the raw authoring date), written in the reader's language. */
export function displayDate(article: Article, locale: Locale): string {
  return formatDate(article.publishedAt ?? article.createdAt, locale);
}
