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
    title: t.privacy.metaTitle,
    description: t.privacy.metaDescription,
    alternates: localeAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <main>
      <section id="privacy" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.privacy.title}
          </h1>
          <p className="mt-4 text-sm text-muted">{t.privacy.date}</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-foreground">
            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.privacy.collectedTitle}
              </h2>
              <ul className="mt-3 space-y-2 text-muted">
                {t.privacy.collectedItems.map((item) => (
                  <li key={item.lead}>
                    <span className="text-foreground">{item.lead}</span>
                    {item.body}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.privacy.notDoneTitle}
              </h2>
              <ul className="mt-3 space-y-2 text-muted">
                {t.privacy.notDoneItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.privacy.outboundTitle}
              </h2>
              <p className="mt-3 text-muted">{t.privacy.outboundBody}</p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.privacy.removalTitle}
              </h2>
              <p className="mt-3 text-muted">
                {t.privacy.removalBefore}
                <Link
                  href={`${localeHref(locale, "/about")}#corrections`}
                  className="text-primary underline underline-offset-4"
                >
                  {t.privacy.removalLink}
                </Link>
                {t.privacy.removalAfter}
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {t.privacy.changesTitle}
              </h2>
              <p className="mt-3 text-muted">{t.privacy.changesBody}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
