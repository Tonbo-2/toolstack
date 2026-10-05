import Image from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { BRAND } from "@/lib/brand";
import { fill, getDictionary, localeHref, type Locale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";
import { FOOTER_ITEMS, NAV_ITEMS, navItemsFor, resolveNavHref } from "@/lib/siteNav";

/**
 * Shared site chrome — the header and footer mounted in
 * `src/app/[locale]/layout.tsx` around every route, and `<SiteLink>`, the ONLY
 * way a chrome link should be written (see src/lib/siteNav.ts for why: a path
 * mount serves this blog on the owner's existing website, where a plain
 * `<Link href="/about">` leaks the visitor to a page of a different site).
 *
 * Every link is wrapped in `localeHref(locale, …)`: it resolves the route for the
 * site's language (bare paths, now that the site is Japanese only) and keeps that
 * rule in one place. Both components therefore take the locale from the layout.
 *
 * Restyle freely for the design direction, but keep every internal link on
 * `<SiteLink>` and every nav list on `navItemsFor(...)` — the nav-structure hook
 * and the mount pre-flight both check for exactly that.
 */

type SiteLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
};

/**
 * A chrome link that follows the mount rules: `<Link>` for a route of this
 * site, a plain `<a>` to the customer's root for the brand/home link on a
 * mount, a new-tab `<a>` for another website — and NOTHING for a route that
 * does not exist on a mount.
 */
export function SiteLink({ href, children, ...rest }: SiteLinkProps) {
  const resolved = resolveNavHref(href);
  if (!resolved) return null;
  if (resolved.kind === "internal") {
    return (
      <Link href={resolved.href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = resolved.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={resolved.href} {...external} {...rest}>
      {children}
    </a>
  );
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = navItemsFor(NAV_ITEMS);
  const homeLabel = fill(t.chrome.homeAria, { site: BRAND.name });
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <SiteLink href={localeHref(locale, "/")} className="flex shrink-0 items-center" aria-label={homeLabel}>
          <Image
            src={BRAND.logoUrl}
            alt={BRAND.name}
            width={BRAND.logoWidth}
            height={BRAND.logoHeight}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </SiteLink>
        {items.length > 0 && (
          <nav aria-label={t.chrome.mainNav} className="hidden items-center gap-7 text-sm text-muted md:flex">
            {items.map((item) => (
              <SiteLink
                key={item.href}
                href={localeHref(locale, item.href)}
                className="transition-colors hover:text-foreground"
              >
                {t.nav[item.labelKey] ?? item.label}
              </SiteLink>
            ))}
          </nav>
        )}
      </div>
      {items.length > 0 && (
        <nav
          aria-label={t.chrome.sectionsNav}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border px-5 py-2 text-sm text-muted md:hidden"
        >
          {items.map((item) => (
            <SiteLink
              key={item.href}
              href={localeHref(locale, item.href)}
              className="whitespace-nowrap py-1 transition-colors hover:text-foreground"
            >
              {t.nav[item.labelKey] ?? item.label}
            </SiteLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = navItemsFor(FOOTER_ITEMS);
  const homeLabel = fill(t.chrome.homeAria, { site: BRAND.name });
  return (
    <footer className="border-t border-border bg-card print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <SiteLink
              href={localeHref(locale, "/")}
              className="inline-flex items-center"
              aria-label={homeLabel}
            >
              <Image
                src={BRAND.logoUrl}
                alt={BRAND.name}
                width={BRAND.logoWidth}
                height={BRAND.logoHeight}
                className="h-6 w-auto"
              />
            </SiteLink>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">{t.chrome.blurb}</p>
          </div>
          <nav aria-label={t.chrome.footerNav} className="flex flex-col gap-3 text-sm text-muted">
            {items.slice(0, 3).map((item) => (
              <SiteLink
                key={item.href}
                href={localeHref(locale, item.href)}
                className="transition-colors hover:text-foreground"
              >
                {t.nav[item.labelKey] ?? item.label}
              </SiteLink>
            ))}
          </nav>
          <nav aria-label={t.chrome.footerLegalAria} className="flex flex-col gap-3 text-sm text-muted">
            {items.slice(3).map((item) => (
              <SiteLink
                key={item.href}
                href={localeHref(locale, item.href)}
                className="transition-colors hover:text-foreground"
              >
                {t.nav[item.labelKey] ?? item.label}
              </SiteLink>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          <p>{fill(t.chrome.copyright, { year: new Date().getFullYear(), site: SITE_NAME })}</p>
        </div>
      </div>
    </footer>
  );
}
