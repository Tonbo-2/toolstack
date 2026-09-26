import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/tools/[slug]/page.tsx`. Safe to delete once the
 * repository can be edited outside this session.
 */
export default async function LegacyTool({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/en/tools/${slug}`);
}
