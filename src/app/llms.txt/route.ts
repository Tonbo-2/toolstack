import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { fetchSiteArticles } from "@/lib/articles";

const LLMS_TXT_MAX_CHARS = 10_000;
const LLMS_DESCRIPTION_MAX_CHARS = 500;

function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function safeLinkTitle(value: string): string {
  return (
    singleLine(value)
      .replace(/[\[\]]/g, "")
      .slice(0, 180) || "記事"
  );
}

// AI-discoverability baseline — shipped on by default. A markdown index that tells
// LLMs what this site is and where its key pages live. Rebuild it from the real
// pages/copy via the `geo` skill: `## H2` groups (主要ページ / 運営情報 / …);
// only list pages that exist. The site is Japanese-only, so the index is written
// in Japanese. Published blog articles are appended automatically under
// `## その他` when the blog is enabled AND the SEO auto-update toggle is on. The
// index is deliberately capped so a growing blog cannot turn this navigation file
// into a context dump.
export async function GET() {
  const blogBasePath = process.env.NEXT_PUBLIC_BLOG_BASE_PATH;
  const articles = await fetchSiteArticles();
  const description = singleLine(SITE_DESCRIPTION).slice(0, LLMS_DESCRIPTION_MAX_CHARS);
  let body = `# ${SITE_NAME}

> ${description}

## 主要ページ
- [ホーム](${SITE_URL}/): ${description}
- [ツール一覧](${SITE_URL}/tools): 仕事で使えるAIツールを1つの表で比較。向いている業務と注意点も掲載。
- [このサイトについて](${SITE_URL}/about): 運営者と、評価の書き方。

## 運営情報
- [アフィリエイト開示](${SITE_URL}/disclosure): サイトの収入源と、評価の独立性。
- [プライバシーポリシー](${SITE_URL}/privacy): 取得する情報とその使い方。
`;

  if (blogBasePath && articles.length) {
    body += `\n## その他\n- [ブログ](${SITE_URL}${blogBasePath}): 最新の記事\n`;
    for (const article of articles) {
      const line = `- [${safeLinkTitle(article.title)}](${SITE_URL}${article.link})\n`;
      if (body.length + line.length > LLMS_TXT_MAX_CHARS) break;
      body += line;
    }
  }

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
