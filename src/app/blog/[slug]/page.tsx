import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/blog/[slug]/page.tsx`. Safe to delete once the
 * repository can be edited outside this session.
 */
export default async function LegacyArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/en/blog/${slug}`);
}
