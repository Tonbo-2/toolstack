import { NextResponse } from "next/server";
import { affiliateTarget } from "@/lib/affiliates";

/**
 * Outbound reviewer link. Every "visit this tool" action points here so the
 * destination lives in ONE file (src/lib/affiliates.ts): when a programme
 * approves the site, the tracked link is swapped there and no page copy changes.
 *
 * A slug with no configured destination goes back to the directory rather than
 * bouncing a reader to a guessed URL.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const target = affiliateTarget(slug);
  // 行き先だけを確かめたいとき（提携先URLの点検）は `?format=json` を付けます。
  // 転送せずに、その場で行き先を返します。訪問者の流れ（302）は変わりません。
  if (new URL(request.url).searchParams.get("format") === "json") {
    return NextResponse.json({
      slug,
      registered: Boolean(target),
      destination: target?.url ?? "/tools",
    });
  }
  // 掲載先が未設定のスラッグは、いま見ているホストのツール一覧へ戻します
  // （公開URLの設定に依存すると、設定が無い環境で別ホストへ飛んでしまうため）。
  if (!target) return NextResponse.redirect(new URL("/tools", request.url), 302);
  return NextResponse.redirect(target.url, 302);
}
