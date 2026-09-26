import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { displayDate, fetchArticle, type Article } from "@/lib/blog";
import { getDictionary, localeHref } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await fetchArticle(slug);
  if (result.kind !== "article") return {};
  const { article } = result;
  const description = article.seoMetaDesc || article.excerpt || undefined;
  // An article is single-language, so it keeps ONE canonical URL (the one the
  // CMS assigns it) however it is reached, and declares no alternate language.
  const canonical = `${SITE_URL}${article.link}`;
  const images = article.heroImageUrl ? [{ url: article.heroImageUrl }] : undefined;
  return {
    title: article.title,
    description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      images,
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: article.heroImageUrl ? [article.heroImageUrl] : undefined,
    },
  };
}

function ArticleJsonLd({ article }: { article: Article }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    ...(article.seoMetaDesc || article.excerpt
      ? { description: article.seoMetaDesc || article.excerpt }
      : {}),
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    mainEntityOfPage: `${SITE_URL}${article.link}`,
    ...(article.keywords?.length ? { keywords: article.keywords.join(", ") } : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const result = await fetchArticle(slug);
  if (result.kind === "redirect") permanentRedirect(result.to);
  if (result.kind === "missing") notFound();
  const { article } = result;
  const t = getDictionary(locale);

  const looksLikeHtml = article.content ? /<\/?[a-z][\s\S]*>/i.test(article.content) : false;
  const clean = looksLikeHtml
    ? sanitizeHtml(article.content ?? "", {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          a: ["href", "name", "target", "rel"],
          img: ["src", "srcset", "alt", "title", "width", "height", "loading"],
          iframe: ["src", "allow", "allowfullscreen", "frameborder", "width", "height"],
        },
        allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
      })
    : null;

  return (
    <main>
      <ArticleJsonLd article={article} />
      <section id="article" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
          <p className="text-sm text-muted">
            <Link
              href={localeHref(locale, "/blog")}
              className="text-primary underline underline-offset-4"
            >
              {t.blog.title}
            </Link>
          </p>
          <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {article.title}
          </h1>
          <time
            dateTime={article.publishedAt ?? article.createdAt}
            className="mt-4 block text-sm text-muted"
          >
            {displayDate(article, locale)}
          </time>
          {article.heroImageUrl && (
            <Image
              src={article.heroImageUrl}
              alt=""
              width={1200}
              height={675}
              priority
              className="mt-8 w-full rounded-lg border border-border"
            />
          )}
          {clean ? (
            <div
              className="prose prose-neutral mt-8 max-w-none prose-headings:font-heading prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: clean }}
            />
          ) : (
            <div className="mt-8 whitespace-pre-wrap text-base leading-7 text-foreground">
              {article.content}
            </div>
          )}
          {article.keywords && article.keywords.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-2">
              {article.keywords.map((keyword) => (
                <li
                  key={keyword}
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs text-muted"
                >
                  {keyword}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
