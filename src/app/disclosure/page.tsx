import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/disclosure/page.tsx`. Safe to delete once the
 * repository can be edited outside this session.
 */
export default function LegacyDisclosure() {
  redirect("/en/disclosure");
}
