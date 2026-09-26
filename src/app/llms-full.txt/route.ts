import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { fetchSiteArticles } from "@/lib/articles";

// Full-content variant of llms.txt (AI-discoverability baseline). The same index as
// llms.txt plus each blog article's summary, so an answer engine can ingest what the
// site says in one fetch. Blog articles append automatically when the blog is
// enabled AND the SEO auto-update toggle is on — no manual entry, and a new post
// appears without a rebuild. Enrich the
// static body (real page copy) via the `geo` skill.
export async function GET() {
  const blogBasePath = process.env.NEXT_PUBLIC_BLOG_BASE_PATH;
  const articles = await fetchSiteArticles();
  const blog =
    blogBasePath && articles.length
      ? `\n## ブログ\n${articles
          .map((a) => `\n### ${a.title}\n${SITE_URL}${a.link}\n${a.excerpt ?? ""}`)
          .join("\n")}\n`
      : "";

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

LLM 向けの全文インデックスです。リンクだけの簡易版は ${SITE_URL}/llms.txt にあります。

## 主要ページ
- [ホーム](${SITE_URL}/): ${SITE_DESCRIPTION}
${blog}`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
