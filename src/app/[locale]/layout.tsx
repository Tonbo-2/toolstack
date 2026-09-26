import type { Metadata } from "next";
import Script from "next/script";
import { notFound } from "next/navigation";
import "../globals.css";
import { sora, inter } from "../fonts";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import StructuredData from "@/components/StructuredData";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import {
  LOCALES,
  getDictionary,
  isLocale,
  localeAlternates,
  ogLocale,
  type Locale,
} from "@/lib/i18n";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

// Default direction = "Clean SaaS" (sora + inter). When you switch design
// direction (see the `design-system` skill), import that direction's font pair
// here instead and apply their `.variable` classes on <html>.
const fontVariables = `${sora.variable} ${inter.variable}`;

// A descriptive home <title> ("Brand | what the site is") reads better in search
// results and browser tabs — and clears the SEO audit's "descriptive title" check —
// than a bare short brand ("Acme"). Pair the brand with the site description,
// trimmed to a SERP-friendly length at a word boundary; a brand already long enough
// to stand alone is left as-is. Non-latin (CJK) descriptions have no spaces, so they
// fall back to a hard character cap.
const HOME_TITLE_MAX = 60;
function composeHomeTitle(brand: string, description: string): string {
  if (brand.length >= 30 || !description) return brand;
  const full = `${brand} | ${description}`;
  if (full.length <= HOME_TITLE_MAX) return full;
  const cut = full.slice(0, HOME_TITLE_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  // No usable word boundary inside the cut (a description in a spaceless script,
  // e.g. Japanese): slicing there would ship a half-written sentence, so keep the
  // title on its own instead.
  return lastSpace > brand.length + 3 ? cut.slice(0, lastSpace) : brand;
}

/** The site's language is prerendered; every route is served under it. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const brand = SITE_NAME;
  // The panel (Manage → SEO & GEO) holds the site description; the site serves a
  // single language, so there is no second copy to choose between.
  const description = SITE_DESCRIPTION;
  // "StackProof | 仕事で使えるAIツールの比較・レビュー" — the brand plus what the
  // site is, taken from the dictionary so the title and the hero stay in step.
  const homeTitle = composeHomeTitle(brand, t.meta.home.title);
  const faviconUrl = process.env.NEXT_PUBLIC_FAVICON_URL;
  const ogImageUrl = process.env.NEXT_PUBLIC_OG_IMAGE_URL;
  // google-site-verification token for verifying this site as a Search Console
  // property (set by the owner in Manage → Analytics).
  const gscVerification = process.env.NEXT_PUBLIC_META_GSC_VERIFICATION;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: homeTitle, template: `%s | ${brand}` },
    description,
    // Canonical for the home page. Every page below sets its own path with the
    // same helper, so deeper metadata overrides this per key.
    alternates: localeAlternates(locale, "/"),
    ...(faviconUrl ? { icons: { icon: faviconUrl } } : {}),
    ...(gscVerification ? { verification: { google: gscVerification } } : {}),
    ...(ogImageUrl
      ? {
          openGraph: {
            title: homeTitle,
            description,
            locale: ogLocale(locale),
            images: [{ url: ogImageUrl }],
          },
          twitter: {
            card: "summary_large_image",
            title: homeTitle,
            description,
            images: [ogImageUrl],
          },
        }
      : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale: Locale = locale;

  // GA4: auto-embedded when the owner links/creates a property in Manage →
  // Analytics (injected as NEXT_PUBLIC_GA_MEASUREMENT_ID at build). The id is
  // interpolated into an inline script, so gate it to the GA/Ads/GTM id format
  // (same discipline as the marketing-pixels skill) before rendering.
  const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaId = rawGaId && /^(G|AW|GT|UA)-[A-Z0-9-]+$/i.test(rawGaId) ? rawGaId : undefined;
  // PostHog: auto-embedded when the owner sets a project API key in Manage →
  // Analytics → PostHog (injected as NEXT_PUBLIC_POSTHOG_KEY / _HOST at build).
  // Key + host are interpolated into an inline script, so gate both to strict
  // formats before rendering. No host (or a malformed one) = US Cloud.
  const rawPhKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const phKey = rawPhKey && /^phc_[A-Za-z0-9]+$/.test(rawPhKey) ? rawPhKey : undefined;
  const rawPhHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "").replace(/\/+$/, "");
  const phHost = /^https:\/\/[A-Za-z0-9.-]+(:\d+)?$/.test(rawPhHost)
    ? rawPhHost
    : "https://us.i.posthog.com";
  return (
    <html lang={typedLocale} className={fontVariables}>
      <head>
        {/* llms.txt v2 discovery: the root index describes every route below /.
            Omitted on a path mount (rpi/website-path-mount): "/llms.txt" there is
            the EXISTING website's root, which we neither serve nor control, so
            the link would point crawlers at someone else's file. */}
        {process.env.NEXT_PUBLIC_BLOG_MOUNT !== "1" && process.env.NEXT_PUBLIC_PATH_MOUNT !== "1" && (
          <link rel="describedby" href="/llms.txt" />
        )}
        {/* Blog feed (RSS) — lives under the configured blog base path. */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${SITE_NAME} articles`}
          href={`${process.env.NEXT_PUBLIC_BLOG_BASE_PATH ?? "/blog"}/rss.xml`}
        />
      </head>
      <body className="antialiased">
        {/* Route-aware JSON-LD @graph (Organization/WebSite/WebPage) ships ON via a
            dedicated component, self-gated on NEXT_PUBLIC_SEO_JSONLD (owner toggle
            in Manage → SEO). Enrich it via the `geo` skill in StructuredData.tsx. */}
        <StructuredData />
        {/* Route-derived BreadcrumbList JSON-LD ships ON; the owner can disable it in
            Manage → SEO, which injects NEXT_PUBLIC_SEO_BREADCRUMBS=off at build. */}
        <BreadcrumbJsonLd />
        {/* Shared chrome around {children} so every route keeps it (navigation-and-anchors.md).
            Both take the locale so every chrome link resolves through localeHref and
            keeps the path-mount rules in one place. */}
        <SiteHeader locale={typedLocale} />
        {children}
        <SiteFooter locale={typedLocale} />
        {process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL && <AnalyticsTracker />}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-gtag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {phKey && (
          <Script id="posthog" strategy="afterInteractive">
            {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify alias register register_once unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing reset isFeatureEnabled getFeatureFlag getFeatureFlagPayload onFeatureFlags reloadFeatureFlags group setPersonProperties startSessionRecording stopSessionRecording get_distinct_id captureException".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('${phKey}',{api_host:'${phHost}',defaults:'2025-05-24'});`}
          </Script>
        )}
      </body>
    </html>
  );
}
