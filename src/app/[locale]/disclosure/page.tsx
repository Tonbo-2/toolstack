import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, localeAlternates, localeHref, resolveLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.disclosure.metaTitle,
    description: t.disclosure.metaDescription,
    alternates: localeAlternates(locale, "/disclosure"),
  };
}

export default async function DisclosurePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <main>
      <section id="disclosure" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.disclosure.title}
          </h1>
          <p className="mt-4 text-sm text-muted">{t.disclosure.date}</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-foreground">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.disclosure.shortTitle}
              </h2>
              <p className="mt-3 text-muted">{t.disclosure.shortBody}</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.disclosure.unchangedTitle}
              </h2>
              <ul className="mt-3 space-y-2 text-muted">
                {t.disclosure.unchangedItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-3 text-muted">{t.disclosure.unchangedOutro}</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.disclosure.questionsTitle}
              </h2>
              <p className="mt-3 text-muted">
                {t.disclosure.questionsBefore}
                <Link
                  href={`${localeHref(locale, "/about")}#corrections`}
                  className="text-primary underline underline-offset-4"
                >
                  {t.disclosure.questionsLink}
                </Link>
                {t.disclosure.questionsMid}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
