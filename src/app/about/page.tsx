import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/about/page.tsx` (served at `/about` and `/ja/about`).
 * Kept as a redirect so no unprefixed request can reach a dead route. Safe to
 * delete once the repository can be edited outside this session.
 */
export default function LegacyAbout() {
  redirect("/en/about");
}
