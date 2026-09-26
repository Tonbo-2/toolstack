import { redirect } from "next/navigation";

/**
 * Moved to `src/app/[locale]/cheat-sheet/page.tsx`. Safe to delete once the
 * repository can be edited outside this session.
 */
export default function LegacyCheatSheet() {
  redirect("/en/cheat-sheet");
}
