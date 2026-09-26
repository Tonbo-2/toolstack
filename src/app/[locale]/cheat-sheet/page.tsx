import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { PrintButton } from "@/components/PrintButton";
import { getDictionary, localeAlternates, localeHref, resolveLocale, type Locale } from "@/lib/i18n";
import { toolBySlug } from "@/lib/tools";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.cheat.metaTitle,
    description: t.cheat.metaDescription,
    alternates: localeAlternates(locale, "/cheat-sheet"),
  };
}

export default async function CheatSheetPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <main>
      <section id="sheet-intro" className="border-b border-border bg-card print:border-b-0">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.cheat.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t.cheat.lead}</p>
          <p className="mt-6 text-sm text-muted">{t.cheat.rule}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton label={t.cheat.printLabel} />
            <Link
              href={localeHref(locale, "/tools")}
              className="inline-flex h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary print:hidden"
            >
              {t.cheat.openDirectory}
            </Link>
          </div>
        </div>
      </section>

      <section id="sheet" className="bg-background print:bg-white">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          {/* A real table on desktop and in print; on small screens each job
              becomes a stacked block with its own column label, so a three-column
              row never squeezes into a handful of characters per line. */}
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{t.cheat.caption}</caption>
            <thead className="hidden border-b border-border text-xs uppercase tracking-wide text-muted md:table-header-group">
              <tr>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.cheat.columnJob}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.cheat.columnReach}
                </th>
                <th scope="col" className="py-3 font-medium">
                  {t.cheat.columnSkip}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.cheat.rows.map((row) => (
                <tr
                  key={row.job}
                  className="block border-b border-border py-5 align-top md:table-row md:py-0"
                >
                  <th
                    scope="row"
                    className="block font-heading text-base font-semibold text-foreground md:table-cell md:py-4 md:pr-4 md:text-sm"
                  >
                    {row.job}
                  </th>
                  <td className="mt-3 block md:mt-0 md:table-cell md:py-4 md:pr-4">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-muted md:hidden">
                      {t.cheat.columnReach}
                    </span>
                    <ul className="flex flex-wrap gap-x-3 gap-y-1">
                      {row.picks.map((slug) => {
                        const tool = toolBySlug(slug, locale);
                        if (!tool) return null;
                        return (
                          <li key={slug} className="text-sm">
                            <Link
                              href={localeHref(locale, `/tools/${slug}`)}
                              className="text-primary underline underline-offset-4"
                            >
                              {tool.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                  <td className="mt-3 block text-sm leading-6 text-muted md:mt-0 md:table-cell md:py-4">
                    <span className="mb-1 block text-xs uppercase tracking-wide text-muted md:hidden">
                      {t.cheat.columnSkip}
                    </span>
                    {row.skip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-8 text-xs leading-5 text-muted">
            {t.cheat.noteBefore}
            <Link
              href={localeHref(locale, "/disclosure")}
              className="text-primary underline underline-offset-4"
            >
              {t.cheat.noteLink}
            </Link>
            {t.cheat.noteAfter}
          </p>
        </div>
      </section>

      <section id="list" className="border-t border-border bg-card print:hidden">
        <div className="mx-auto grid max-w-4xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
              {t.cheat.listTitle}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">{t.cheat.listLead}</p>
          </div>
          <LeadForm
            cta={t.cheat.formCta}
            strings={t.form}
            successMessage={t.cheat.formSuccess}
            successHref={localeHref(locale, "/tools")}
            successLabel={t.cheat.formHrefLabel}
          />
        </div>
      </section>
    </main>
  );
}
