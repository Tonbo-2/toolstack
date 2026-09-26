import { SITE_URL } from "@/lib/site";

/**
 * Site navigation — the ONE list the header and footer render from, plus the
 * path-mount rules every internal link in shared chrome must follow.
 *
 * A path mount (rpi/website-path-mount) deploys this site's blog at ONE path on
 * a website the owner already runs (`https://example.com/blog`). There,
 * `NEXT_PUBLIC_SITE_URL` is THEIR origin and every path outside the mounted
 * prefix belongs to THEIR existing site: a chrome link to `/about` does not
 * 404, it silently hands the visitor to a page of a different website. The
 * mount build reads the RENDERED HTML and refuses an artifact whose chrome
 * links outside the prefix — so keep every chrome link on these helpers and
 * `<SiteLink>` (src/components/SiteChrome.tsx), which apply the rules for you:
 *
 *   - brand / home link → an absolute URL to the customer's root on a mount;
 *   - nav items outside the mounted path → omitted on a mount;
 *   - links inside the mounted path → unchanged.
 *
 * Off a mount (the normal site, previews) they are plain `<Link>`s.
 */

export interface NavItem {
  /** Dictionary key for the label (`Dictionary["nav"][labelKey]`). */
  labelKey: NavLabelKey;
  /** Japanese label — the fallback if a dictionary key is missing. */
  label: string;
  /** Root-relative route (`/pricing`, `/#team`) or an absolute external URL. */
  href: string;
}

/** Every label a nav entry may point at. Keep in step with `nav` in the dictionaries. */
export type NavLabelKey =
  | "tools"
  | "stacks"
  | "cheatSheet"
  | "blog"
  | "about"
  | "directory"
  | "workflowSheet"
  | "aboutMethodology"
  | "disclosure"
  | "privacy";

/**
 * Top-level navigation. Every entry is a ROUTE that exists (or a root-absolute
 * home-page section like `/#team`) — see navigation-and-anchors.md. Edit this
 * list, not the header/footer markup, when pages are added or renamed.
 *
 * Entries stay UNPREFIXED on a multi-language site too: one list for every
 * language, and the chrome wraps each href in `localeHref(locale, …)` as it
 * renders. Putting a locale in here instead pins the nav to one language.
 */
export const NAV_ITEMS: NavItem[] = [
  { labelKey: "tools", label: "ツール", href: "/tools" },
  { labelKey: "stacks", label: "組み合わせ", href: "/#stacks" },
  { labelKey: "cheatSheet", label: "チートシート", href: "/cheat-sheet" },
  { labelKey: "blog", label: "ブログ", href: "/blog" },
  { labelKey: "about", label: "このサイト", href: "/about" },
];

/** Footer-only links (legal pages etc.). Same rules as NAV_ITEMS. */
export const FOOTER_ITEMS: NavItem[] = [
  { labelKey: "directory", label: "ツール一覧", href: "/tools" },
  { labelKey: "workflowSheet", label: "ワークフロー・チートシート", href: "/cheat-sheet" },
  { labelKey: "blog", label: "ブログ", href: "/blog" },
  { labelKey: "aboutMethodology", label: "運営方針と検証手法", href: "/about" },
  { labelKey: "disclosure", label: "アフィリエイト開示", href: "/disclosure" },
  { labelKey: "privacy", label: "プライバシー", href: "/privacy" },
];

/**
 * Route → name, for the JSON-LD nodes a route slug would otherwise name in
 * English (BreadcrumbList steps, the WebPage name). Anything not listed here —
 * a tool or article slug — is used as-is, which is right for product and article
 * names.
 */
export const ROUTE_NAMES: Record<string, string> = {
  tools: "ツール一覧",
  "cheat-sheet": "ワークフロー・チートシート",
  about: "このサイトについて",
  disclosure: "アフィリエイト開示",
  privacy: "プライバシーポリシー",
  blog: "ブログ",
};

/** True in a path-mount build. Inlined at build time (NEXT_PUBLIC_*). */
export const IS_MOUNT =
  process.env.NEXT_PUBLIC_BLOG_MOUNT === "1" || process.env.NEXT_PUBLIC_PATH_MOUNT === "1";

/** The mounted prefix (`/blog`) in a mount build; "" otherwise. */
export const MOUNT_PATH = (
  process.env.NEXT_PUBLIC_MOUNT_PATH_PREFIX ??
  process.env.NEXT_PUBLIC_BLOG_BASE_PATH ??
  ""
).replace(/\/+$/, "");

function isAbsolute(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/** Does this href stay inside the mounted path? (Only meaningful on a mount.) */
export function isOnMount(href: string): boolean {
  if (!MOUNT_PATH) return false;
  return (
    href === MOUNT_PATH ||
    href.startsWith(`${MOUNT_PATH}/`) ||
    href.startsWith(`${MOUNT_PATH}?`) ||
    href.startsWith(`${MOUNT_PATH}#`)
  );
}

export interface ResolvedNavHref {
  href: string;
  /**
   * `internal` → `<Link>`; `external` → `<a target="_blank">` (another
   * website); `site-root` → a plain `<a>` to the customer's own root on a
   * mount — same website from the visitor's point of view, so no new tab.
   */
  kind: "internal" | "external" | "site-root";
}

/**
 * Where a chrome link actually goes. `null` means "do not render this link at
 * all" — an off-mount route on a mount.
 */
export function resolveNavHref(href: string): ResolvedNavHref | null {
  if (isAbsolute(href)) return { href, kind: "external" };
  if (!IS_MOUNT) return { href, kind: "internal" };
  if (href === "/" || href.startsWith("/#") || href.startsWith("/?")) {
    // The brand/home link keeps working on a mount: it goes to the customer's
    // own root (SITE_URL is their origin there). A home-page section anchor
    // has no home page to scroll on a mount, so it becomes the root as well.
    return { href: `${SITE_URL}/`, kind: "site-root" };
  }
  if (!href.startsWith("/")) return { href, kind: "internal" }; // relative / query-only
  return isOnMount(href) ? { href, kind: "internal" } : null;
}

/** The nav items that may render in the current build (all of them off a mount). */
export function navItemsFor<T extends NavItem>(items: readonly T[]): T[] {
  return items.filter((item) => resolveNavHref(item.href) !== null);
}

/** The brand link target: `/` normally, the customer's root on a mount. */
export function homeHref(): string {
  return resolveNavHref("/")?.href ?? "/";
}
