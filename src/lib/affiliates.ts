/**
 * Outbound destinations for reviewer links (served through /go/[slug]).
 *
 * OWNER ACTION: replace each `url` with your tracked affiliate link (or add
 * `?ref=` / your program's parameters) once a programme approves you. Until
 * then the entry falls back to the vendor homepage, so no reader hits a dead
 * link. `program` and `terms` are notes for you; they are never rendered as
 * facts on the site.
 *
 * The redirect route is the only place a destination is read, so a link change
 * is one edit and never touches page copy.
 */
export interface AffiliateTarget {
  /** Vendor homepage, or your tracked link once a programme approves you. */
  url: string;
  /** Where the commission would come from, for your own bookkeeping. */
  program?: string;
  /** Cookie window / payout note as you confirmed it. Never rendered. */
  terms?: string;
}

export const AFFILIATES: Record<string, AffiliateTarget> = {
  notion: { url: "https://www.notion.so", program: "Vendor direct / Notion AI" },
  zapier: { url: "https://zapier.com", program: "Vendor direct" },
  make: { url: "https://www.make.com", program: "Vendor direct" },
  jasper: { url: "https://www.jasper.ai", program: "Vendor direct (recurring)" },
  writesonic: { url: "https://writesonic.com", program: "Vendor direct" },
  "surfer-seo": { url: "https://surferseo.com", program: "Vendor direct (recurring)" },
  kit: { url: "https://kit.com", program: "PartnerStack (recurring)" },
  getresponse: { url: "https://www.getresponse.com", program: "PartnerStack" },
  elevenlabs: { url: "https://elevenlabs.io", program: "Vendor direct" },
  "otter-ai": { url: "https://otter.ai", program: "Vendor direct" },
};

export function affiliateTarget(slug: string): AffiliateTarget | undefined {
  return AFFILIATES[slug];
}
