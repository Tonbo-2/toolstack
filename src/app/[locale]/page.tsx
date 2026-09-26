import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { ToolMark } from "@/components/ToolMark";
import { BRAND } from "@/lib/brand";
import { displayDate, fetchArticles } from "@/lib/blog";
import { fill, getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { categoriesFor, stacksFor, toolBySlug, toolsFor, type LocalizedTool } from "@/lib/tools";

export const revalidate = 60;

const FEATURED_SLUGS = ["notion", "zapier", "writesonic", "kit", "elevenlabs", "otter-ai"];

const buttonPrimary =
  "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90";
const buttonSecondary =
  "inline-flex h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary";
const chip =
  "inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:border-primary hover:text-foreground";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { articles } = await fetchArticles(1, 3);
  const tools = toolsFor(locale);
  const categories = categoriesFor(locale);
  const stacks = stacksFor(locale);
  const featured = FEATURED_SLUGS.map((slug) => toolBySlug(slug, locale)).filter(
    (tool): tool is LocalizedTool => Boolean(tool),
  );

  return (
    <main>
      <section id="hero" className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t.home.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              {t.home.title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted">{t.home.lead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={localeHref(locale, "/tools")} className={buttonPrimary}>
                {t.home.ctaPrimary}
              </Link>
              <Link href={localeHref(locale, "/cheat-sheet")} className={buttonSecondary}>
                {t.home.ctaSecondary}
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">{t.home.heroNote}</p>
          </div>
          <Image
            src={BRAND.heroImage}
            alt={t.home.heroAlt}
            width={1600}
            height={900}
            priority
            className="w-full rounded-lg border border-border shadow-soft"
          />
        </div>
      </section>

      <section id="method" className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t.home.methodTitle}
          </h2>
          <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.method.map((item) => (
              <div key={item.title} className="border-t border-border pt-4">
                <dt className="font-heading text-base font-semibold text-foreground">{item.title}</dt>
                <dd className="mt-2 text-sm leading-6 text-muted">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="directory" className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {t.home.directoryTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                {fill(t.home.directoryLead, {
                  tools: tools.length,
                  categories: categories.length,
                })}
              </p>
            </div>
            <Link
              href={localeHref(locale, "/tools")}
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              {fill(t.home.seeAll, { tools: tools.length })}
            </Link>
          </div>

          <ul className="mt-8 border-y border-border">
            {featured.map((tool) => (
              <li
                key={tool.slug}
                className="grid gap-2 border-b border-border py-5 last:border-b-0 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1.6fr)] sm:items-center"
              >
                <span className="flex items-center gap-3">
                  <ToolMark logo={tool.logo} />
                  <Link
                    href={localeHref(locale, `/tools/${tool.slug}`)}
                    className="font-heading font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {tool.name}
                  </Link>
                </span>
                <span className="text-sm text-muted">
                  {categories.find((c) => c.slug === tool.category)?.label}
                </span>
                <span className="text-sm leading-6 text-muted">{tool.bestFor}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`${localeHref(locale, "/tools")}?category=${category.slug}`}
                className={chip}
              >
                {category.label}
                <span className="text-xs text-muted">
                  {tools.filter((tool) => tool.category === category.slug).length}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="stacks" className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            {t.home.stacksTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{t.home.stacksLead}</p>
          <div className="mt-10 border-t border-border">
            {stacks.map((stack) => (
              <article
                key={stack.slug}
                className="grid gap-6 border-b border-border py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
              >
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{stack.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{stack.forWho}</p>
                </div>
                <div>
                  <ul className="flex flex-wrap gap-2">
                    {stack.toolSlugs.map((slug) => {
                      const tool = toolBySlug(slug, locale);
                      if (!tool) return null;
                      return (
                        <li key={slug}>
                          <Link href={localeHref(locale, `/tools/${slug}`)} className={chip}>
                            <ToolMark logo={tool.logo} size={20} />
                            {tool.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-4 text-sm leading-6 text-muted">{stack.why}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {articles.length > 0 && (
        <section id="teardowns" className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {t.home.teardownsTitle}
            </h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <li key={article.websiteArticleId}>
                  <Link href={article.link} className="block h-full">
                    <article className="flex h-full flex-col rounded-md border border-border bg-card p-6 transition-colors hover:border-primary">
                      <time dateTime={article.publishedAt ?? article.createdAt} className="text-xs text-muted">
                        {displayDate(article, locale)}
                      </time>
                      <h3 className="mt-3 font-heading text-base font-semibold text-foreground">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-3 text-sm leading-6 text-muted">{article.excerpt}</p>
                      )}
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="policy" className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2">
          <Image
            src={BRAND.deskImage}
            alt={t.home.deskAlt}
            width={1536}
            height={1024}
            className="w-full rounded-lg border border-border"
          />
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              {t.home.policyTitle}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-muted">
              {t.home.policyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href={localeHref(locale, "/disclosure")}
              className="mt-6 inline-block text-sm font-semibold text-primary underline underline-offset-4"
            >
              {t.home.policyLink}
            </Link>
          </div>
        </div>
      </section>

      <section id="cheat-sheet" className="bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-background sm:text-3xl">
              {t.home.cheatTitle}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-background/80">{t.home.cheatLead}</p>
            <p className="mt-4 text-sm text-background/80">
              <Link
                href={localeHref(locale, "/cheat-sheet")}
                className="underline decoration-accent underline-offset-4"
              >
                {t.home.cheatRead}
              </Link>{" "}
              {t.home.cheatJoinNote}
            </p>
          </div>
          <div className="rounded-lg border border-background/20 bg-background/5 p-6">
            <LeadForm
              tone="dark"
              cta={t.cheat.formCta}
              strings={t.form}
              successMessage={t.cheat.formSuccess}
              successHref={localeHref(locale, "/cheat-sheet")}
              successLabel={t.home.ctaSecondary}
            />
            <p className="mt-4 text-xs leading-5 text-background/70">{t.home.cheatFormNote}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
