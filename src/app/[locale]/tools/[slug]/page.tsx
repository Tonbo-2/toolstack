import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InlineEmphasis } from "@/components/InlineEmphasis";
import { ToolMark } from "@/components/ToolMark";
import {
  getDictionary,
  localeAlternates,
  localeHref,
  resolveLocale,
  type Locale,
} from "@/lib/i18n";
import {
  categoryBySlug,
  formatReviewed,
  toolBySlug,
  toolDisplayName,
  toolsInCategory,
} from "@/lib/tools";

/**
 * The meta description: what the tool is, who it suits, then its biggest trade-off.
 * A search result is truncated somewhere past 160 characters, so the trade-off
 * is cut to its first sentence and any remaining overflow at a sentence or word
 * boundary — a description that stops mid-word reads as broken copy in the SERP.
 */
function summarize(bestFor: string, watchFor: string, locale: Locale): string {
  // 本文の「**」は画面では太字になる記号。検索結果には記号を出さない。
  const plain = (value: string) => value.replace(/\*\*/g, "");
  const stop = locale === "ja" ? "。" : ". ";
  const cut = watchFor.indexOf(stop);
  const tradeoff = cut >= 0 ? watchFor.slice(0, cut + 1) : watchFor;
  // `bestFor` may carry a "\n" between the description and the fit line; a meta
  // description is a single line, so the break collapses to a space.
  const fit = plain(bestFor).replace(/\s+/g, " ").trim();
  const full = `${fit} ${plain(tradeoff)}`.trim();
  if (full.length <= 160) return full;
  if (locale === "ja") {
    const slice = full.slice(0, 159);
    const lastStop = slice.lastIndexOf("。");
    return lastStop > 20 ? slice.slice(0, lastStop + 1) : `${slice}…`;
  }
  const slice = full.slice(0, 157);
  const lastSpace = slice.lastIndexOf(" ");
  return `${slice.slice(0, lastSpace > 0 ? lastSpace : slice.length).replace(/[.,;:]$/, "")}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const tool = toolBySlug(slug, locale);
  if (!tool) return {};
  const t = getDictionary(locale);

  return {
    title: `${tool.name} ${t.tool.reviewSuffix}`,
    description: summarize(tool.bestFor, tool.watchFor, locale),
    alternates: localeAlternates(locale, `/tools/${slug}`),
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tool = toolBySlug(slug, locale);
  if (!tool) notFound();
  const t = getDictionary(locale);
  const category = categoryBySlug(tool.category, locale);
  const related = toolsInCategory(tool.category, locale).filter((item) => item.slug !== tool.slug);
  const pairs = tool.pairsWith
    .map((pairSlug) => toolBySlug(pairSlug, locale))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main>
      <section id="tool-header" className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <p className="text-sm text-muted">
            <Link
              href={localeHref(locale, "/tools")}
              className="text-primary underline underline-offset-4"
            >
              {t.tool.breadcrumb}
            </Link>
          </p>
          <div className="mt-6 flex items-start gap-4">
            <ToolMark logo={tool.logo} size={48} />
            <div>
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {toolDisplayName(tool)}
              </h1>
              <p className="mt-2 text-sm text-muted">
                {category?.label} · {t.tool.reviewedLabel.replace("{date}", formatReviewed(tool.reviewed, locale))}
              </p>
            </div>
          </div>
          {/* 評価は複数行で届く欄。ほかの3欄と同じく文と文の間の改行をそのまま出し、
              本文に混じる「**」の囲みは太字にして出す（InlineEmphasis）。
              4欄（評価・向いている人・メリット・注意点）とも同じ扱いに揃えている。 */}
          <p className="mt-8 whitespace-pre-line border-l-2 border-accent pl-4 text-base leading-7 text-foreground">
            <InlineEmphasis text={tool.verdict} />
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/go/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.tool.visitLabel.replace("{name}", toolDisplayName(tool))}
            </Link>
          </div>
        </div>
      </section>

      <section id="assessment" className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          {/* 3欄（向いている人・メリット・注意点）は横に並べず、縦に積んで読む。
              箇条書きが1行で収まる長さなので、狭い3列に割ると折り返しばかりになり、
              欄ごとに見出し→本文の順で上から下へ流れるほうが読みやすい。
              3欄とも同じ作法（見出し＝上、本文＝その下）で、注意点だけ罫線をアクセント色にする。 */}
          <dl className="grid gap-6">
            <div className="border-t border-border pt-4">
              <dt className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
                {t.tool.bestFor}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-base leading-7 text-muted">
                <InlineEmphasis text={tool.bestFor} />
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
                {t.tool.standout}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-base leading-7 text-muted">
                <InlineEmphasis text={tool.standout} />
              </dd>
            </div>
            <div className="border-t border-accent pt-4">
              <dt className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
                {t.tool.watchFor}
              </dt>
              <dd className="mt-2 whitespace-pre-line text-base leading-7 text-muted">
                <InlineEmphasis text={tool.watchFor} />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {pairs.length > 0 && (
        <section id="pairs-with" className="border-b border-border bg-card">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t.tool.runsBeside}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {pairs.map((pair) => (
                <li key={pair.slug}>
                  <Link
                    href={localeHref(locale, `/tools/${pair.slug}`)}
                    className="flex items-center gap-3 rounded-md border border-border bg-background p-4 transition-colors hover:border-primary"
                  >
                    <ToolMark logo={pair.logo} />
                    <span className="font-heading text-sm font-semibold text-foreground">
                      {toolDisplayName(pair)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section id="related" className="bg-background">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t.tool.otherTools.replace("{category}", category?.label ?? "")}
            </h2>
            <ul className="mt-6 border-t border-border">
              {related.map((item) => (
                <li key={item.slug} className="border-b border-border py-4">
                  <Link
                    href={localeHref(locale, `/tools/${item.slug}`)}
                    className="flex flex-wrap items-center gap-3 font-heading text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    <ToolMark logo={item.logo} size={22} />
                    {toolDisplayName(item)}
                  </Link>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
                    <InlineEmphasis text={item.bestFor} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
