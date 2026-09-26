import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/**
 * Web app manifest (served at /manifest.webmanifest, <link rel="manifest"> is
 * injected by Next automatically). Makes the published site installable /
 * mobile-app-ready — the platform's "Publish → Mobile app" scan checks for it.
 * Identity comes from the shared site constants; the icon reuses the owner's
 * favicon (Manage → SEO & GEO) when set.
 */
export default function manifest(): MetadataRoute.Manifest {
  const faviconUrl = process.env.NEXT_PUBLIC_FAVICON_URL;
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    ...(faviconUrl ? { icons: [{ src: faviconUrl, sizes: "any" }] } : {}),
  };
}
