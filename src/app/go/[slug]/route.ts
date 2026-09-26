import { NextResponse } from "next/server";
import { affiliateTarget } from "@/lib/affiliates";
import { SITE_URL } from "@/lib/site";

/**
 * Outbound reviewer link. Every "visit this tool" action points here so the
 * destination lives in ONE file (src/lib/affiliates.ts): when a programme
 * approves the site, the tracked link is swapped there and no page copy changes.
 *
 * A slug with no configured destination goes back to the directory rather than
 * bouncing a reader to a guessed URL.
 */
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = affiliateTarget(slug);
  if (!target) return NextResponse.redirect(new URL("/tools", SITE_URL), 302);
  return NextResponse.redirect(target.url, 302);
}
