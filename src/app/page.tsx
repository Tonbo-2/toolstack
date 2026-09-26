import { redirect } from "next/navigation";

/**
 * Leftover of the earlier routing: the real home page is
 * `src/app/[locale]/page.tsx`, which src/proxy.ts rewrites `/` to internally, so
 * this file is never reached (its `/en` target no longer exists either). It stays
 * only because this session cannot delete files — remove it when the repository
 * can be edited outside the builder.
 */
export default function LegacyHome() {
  redirect("/en");
}
