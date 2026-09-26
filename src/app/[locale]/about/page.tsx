import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { getDictionary, localeAlternates, localeHref, resolveLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    alternates: localeAlternates(locale, "/about"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <main>
      <section id="about-intro" className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.about.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-foreground">{t.about.lead}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t.about.lead2}</p>
        </div>
      </section>

      <section id="rules" className="border-b border-border bg-background">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t.about.rulesTitle}
          </h2>
          <dl className="mt-8 grid gap-8 sm:grid-cols-2">
            {t.about.rules.map((rule) => (
              <div key={rule.title} className="border-t border-border pt-4">
                <dt className="font-heading text-base font-semibold text-foreground">{rule.title}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted">{rule.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="funding" className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t.about.fundingTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t.about.funding}</p>
          <Link
            href={localeHref(locale, "/disclosure")}
            className="mt-4 inline-block text-sm font-semibold text-primary underline underline-offset-4"
          >
            {t.about.fundingLink}
          </Link>
        </div>
      </section>

      <section id="corrections" className="bg-background">
        <div className="mx-auto grid max-w-4xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {t.about.correctionsTitle}
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted">{t.about.correctionsBody}</p>
            <p className="mt-4 text-sm leading-6 text-muted">{t.about.correctionsBody2}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <LeadForm
              variant="message"
              cta={t.about.formCta}
              strings={t.form}
              successMessage={t.about.formSuccess}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
