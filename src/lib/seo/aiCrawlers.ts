// AI answer-engine crawlers explicitly allowed for AI-discoverability (GEO). Many
// sites block them, but for GEO we want them in. The owner's "AI crawler access"
// toggle is enforced deterministically: turning it OFF injects
// NEXT_PUBLIC_SEO_AI_CRAWLERS=off and `aiCrawlerRule()` flips this block from allow
// to disallow (no AI edit needed). Used by `src/app/robots.ts`.
//
// Tokens must stay vendor-current: the Noimos AI Site Visibility audit deducts for
// a blocked/absent RETRIEVAL crawler and flags retired tokens as no longer matching
// any live crawler. Retired (never emit): Claude-Web, Anthropic-ai, Cohere-ai, YouBot.

// Crawlers whose access decides whether this site can be CITED in an AI answer
// (retrieval / user-triggered fetch). These are the ones that actually cost
// visibility when blocked.
export const AI_RETRIEVAL_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "OAI-AdsBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "MistralAI-User",
  "DuckAssistBot",
  "Meta-ExternalFetcher",
];

// Tokens that govern model training, dataset building, or model grounding rather
// than classic search visibility. Google-Extended is a robots product token, not a
// standalone HTTP crawler user-agent, and Google says it does not affect Search.
// Kept in the same toggle as retrieval: the owner's switch is one "AI crawler
// access" decision. Bingbot is deliberately absent from both lists — it serves
// classic Bing search as well as Copilot, so the toggle must never disallow it.
export const AI_TRAINING_CRAWLERS = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
];

export const AI_CRAWLERS = [...AI_RETRIEVAL_CRAWLERS, ...AI_TRAINING_CRAWLERS];

// The robots rule for the AI-crawler block — allow by default, disallow when the
// owner turns the toggle off. Spread into robots.ts `rules`.
export function aiCrawlerRule() {
  const aiOff = process.env.NEXT_PUBLIC_SEO_AI_CRAWLERS === "off";
  return aiOff ? { userAgent: AI_CRAWLERS, disallow: "/" } : { userAgent: AI_CRAWLERS, allow: "/" };
}
