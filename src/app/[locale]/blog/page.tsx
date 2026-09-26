import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { displayDate, fetchArticles } from "@/lib/blog";
import { getDictionary, localeAlternates, localeHref, resolveLocale, type Locale } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const t = getDictionary(locale);
  return {
    title: t.blog.metaTitle,
    description: t.blog.metaDescription,
    alternates: localeAlternates(locale, "/blog"),
  };
}

export default async function BlogIndex({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const { articles } = await fetchArticles(1, 20);

  return (
    <main>
      <section id="blog-intro" className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t.blog.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{t.blog.lead}</p>
        </div>
      </section>

      <section id="articles" className="bg-background">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
          {articles.length === 0 ? (
            <div className="rounded-md border border-border bg-card p-8">
              <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
                {t.blog.emptyTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{t.blog.emptyBody}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={localeHref(locale, "/tools")}
                  className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {t.blog.openDirectory}
                </Link>
                <Link
                  href={localeHref(locale, "/cheat-sheet")}
                  className="inline-flex h-11 items-center rounded-md border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {t.blog.readCheat}
                </Link>
              </div>
            </div>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2">
              {articles.map((article) => (
                <li key={article.websiteArticleId}>
                  <Link href={article.link} className="group block h-full">
                    <article className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-colors group-hover:border-primary">
                      {article.heroImageUrl && (
                        <Image
                          src={article.heroImageUrl}
                          alt=""
                          width={1200}
                          height={630}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <time
                          dateTime={article.publishedAt ?? article.createdAt}
                          className="text-xs text-muted"
                        >
                          {displayDate(article, locale)}
                        </time>
                        <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="mt-3 text-sm leading-6 text-muted">{article.excerpt}</p>
                        )}
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
