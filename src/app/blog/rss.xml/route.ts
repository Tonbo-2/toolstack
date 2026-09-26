import { fetchArticles } from "@/lib/blog";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const revalidate = 300; // RSS only — the site's own freshness bound is 60s

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  const { articles } = await fetchArticles(1, 50);
  const items = articles
    .map(
      (a) => `
    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(SITE_URL + a.link)}</link>
      <guid>${esc(SITE_URL + a.link)}</guid>
      ${a.excerpt ? `<description>${esc(a.excerpt)}</description>` : ""}
      <pubDate>${new Date(a.publishedAt || a.createdAt).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(
    SITE_NAME,
  )}</title><link>${esc(SITE_URL)}</link><description>${esc(
    SITE_DESCRIPTION,
  )}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
