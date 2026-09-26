import type { Metadata } from "next";
import Link from "next/link";
import { ToolExplorer } from "@/components/ToolExplorer";
import { SITE_URL } from "@/lib/site";
import { getDictionary, localeAlternates, localeHref, resolveLocale, type Locale } from "@/lib/i18n";
import { categoriesFor, toolsFor } from "@/lib/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.tools.metaTitle,
    description: t.tools.metaDescription,
    alternates: localeAlternates(locale, "/tools"),
  };
}

export default async function ToolsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category = "" } = await searchParams;
  const t = getDictionary(locale);
  const tools = toolsFor(locale);
  const categories = categoriesFor(locale);
  const initialCategory = categories.some((c) => c.slug === category) ? category : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.tools.jsonLdName,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}${localeHref(locale, `/tools/${tool.slug}`)}`,
    })),
  };

  return (
    <main>
      <section id="directory-intro" className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.tools.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
            {t.tools.lead.replace("{tools}", String(tools.length))}
          </p>
        </div>
      </section>

      <section id="directory" className="bg-background">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
          <ToolExplorer
            tools={tools}
            categories={categories}
            initialCategory={initialCategory}
            locale={locale}
            labels={{
              searchLabel: t.explorer.searchLabel,
              searchPlaceholder: t.explorer.searchPlaceholder,
              allTools: t.explorer.allTools,
              shownOne: t.explorer.shownOne,
              shownMany: t.explorer.shownMany,
              caption: t.explorer.caption,
              columnTool: t.explorer.columnTool,
              columnCategory: t.explorer.columnCategory,
              columnBestFor: t.explorer.columnBestFor,
              columnWatchFor: t.explorer.columnWatchFor,
              empty: t.explorer.empty,
            }}
          />

          <p className="mt-10 rounded-md border border-border bg-card p-4 text-xs leading-5 text-muted">
            {t.tools.disclosureBefore}
            <Link
              href={localeHref(locale, "/disclosure")}
              className="text-primary underline underline-offset-4"
            >
              {t.tools.disclosureLink}
            </Link>
            {t.tools.disclosureAfter}
          </p>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
