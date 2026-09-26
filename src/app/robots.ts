import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { aiCrawlerRule } from "@/lib/seo/aiCrawlers";

// AI-discoverability baseline — shipped on by default. Explicitly allow AI
// answer-engine crawlers (many sites block them, but for GEO we want them in) and
// point every crawler at the sitemap. The AI-crawler allow-list + its allow/disallow
// rule live in `@/lib/seo/aiCrawlers` (self-gated on the owner's "AI crawler access"
// toggle via NEXT_PUBLIC_SEO_AI_CRAWLERS). Enrich via the `geo` skill.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }, aiCrawlerRule()],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
