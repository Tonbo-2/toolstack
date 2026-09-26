import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/privacy/page.tsx`. Safe to delete once the
 * repository can be edited outside this session.
 */
export default function LegacyPrivacy() {
  redirect("/en/privacy");
}
