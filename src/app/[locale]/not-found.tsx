"use client";

import { useParams } from "next/navigation";
import { SiteLink } from "@/components/SiteChrome";
import { fill, getDictionary, localeHref, resolveLocale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/site";

// Branded 404, in the visitor's language. `not-found.tsx` receives no route
// params, so the locale comes from the URL the visitor was on — a client
// component is the only place that is readable here.
export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = resolveLocale(params?.locale);
  const t = getDictionary(locale);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t.notFound.title}</h1>
        <p className="max-w-md text-muted">{t.notFound.body}</p>
      </div>
      <SiteLink
        href={localeHref(locale, "/")}
        className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
      >
        {fill(t.notFound.cta, { site: SITE_NAME })}
      </SiteLink>
    </main>
  );
}
