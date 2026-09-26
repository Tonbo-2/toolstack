import { readFileSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

type NextRedirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

// Old-URL → new-URL map for a site that replaced an existing one, written into
// the project root by the platform at build time from the owner's redirect table
// (Manage → SEO / recorded by the builder while cloning the source site). Kept
// OUT of source control on purpose: it is data, not code, and the agent must not
// hand-edit it. Absent (local dev, a site that never migrated) → no redirects.
function loadNoimosRedirects(): NextRedirects {
  try {
    const raw = readFileSync(path.join(__dirname, ".noimos-redirects.json"), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Next validates this list and FAILS THE BUILD on a malformed entry, which
    // would turn one bad pasted row into a site that can no longer publish at
    // all. Drop anything that isn't obviously well-formed instead.
    return parsed.filter((entry): entry is NextRedirects[number] => {
      const e = entry as { source?: unknown; destination?: unknown; statusCode?: unknown };
      return (
        typeof e?.source === "string" &&
        e.source.startsWith("/") &&
        typeof e.destination === "string" &&
        e.destination.length > 0 &&
        (e.statusCode === 301 || e.statusCode === 302)
      );
    });
  } catch {
    return [];
  }
}

type NextHeaders = Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>;

const NOINDEX_HEADER = { key: "X-Robots-Tag", value: "noindex, nofollow" };

// What this artifact tells crawlers. The platform decides (seoVisibilityService)
// and injects at most one of these at build time; this only applies the decision.
//
// NEXT_PUBLIC_SEO_NOINDEX — the whole site is unlisted, on EVERY host including
// the owner's own domain. Set by the owner's switch (Manage → SEO / the publish
// flow's Review step) and always for a preview deploy.
//
// NEXT_PUBLIC_SEO_PLATFORM_NOINDEX (+ _SUFFIX) — the site is indexable, but only
// where it actually lives. A site whose real home is the owner's domain is ALSO
// reachable at the platform host it publishes to ({websiteId}.{SITES_DOMAIN} and
// any chosen slug), and that copy is invisible trouble twice: before the
// switchover it is a full copy of a site still live elsewhere, and after it a
// competitor of the real domain. The rule is HOST-SCOPED on purpose — the
// owner's domain can never match it, so this cannot deindex the real site, not
// even in the window where DNS has already moved but the certificate is still
// issuing and the owner's domain is served by this exact artifact.
//
// robots.txt keeps saying `allow: /` either way: a `Disallow` would stop the
// crawl that has to READ these headers, leaving anything already indexed sitting
// in the index indefinitely.
function searchVisibilityHeaders(): NextHeaders {
  if (process.env.NEXT_PUBLIC_SEO_NOINDEX === "1") {
    return [{ source: "/:path*", headers: [NOINDEX_HEADER] }];
  }
  const suffix = process.env.NEXT_PUBLIC_SEO_PLATFORM_SUFFIX;
  if (process.env.NEXT_PUBLIC_SEO_PLATFORM_NOINDEX !== "1" || !suffix) return [];
  // The trailing `$` is load-bearing: OpenNext tests `has` values with a bare
  // `new RegExp(value)` (unanchored), so without it the rule would also fire on
  // any host merely CONTAINING the platform domain.
  const escaped = suffix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [
    {
      source: "/:path*",
      has: [{ type: "host", value: `.*\\.${escaped}$` }],
      headers: [NOINDEX_HEADER],
    },
  ];
}

// Local builder dev only: generated-image assets live on the Firebase Storage
// emulator and the platform injects NOIMOS_ASSET_EMULATOR_ORIGIN
// (e.g. "http://127.0.0.1:9199") when building / serving the site. Unset in
// production, where only the GCS pattern below applies.
const assetEmulatorUrl = (() => {
  const origin = process.env.NOIMOS_ASSET_EMULATOR_ORIGIN;
  if (!origin) return null;
  try {
    return new URL(origin);
  } catch {
    return null;
  }
})();

// Live-preview (editor) dev server only: the preview proxy injects
// WB_LIVE_ASSET_PREFIX="/live/{workspaceId}/{websiteId}" at spawn so every
// /_next asset URL carries the site's routing context in its PATH. The preview
// service runs on multiple instances, each with its own in-memory dev server;
// path-scoped asset URLs let ANY instance route (and boot) deterministically
// instead of inferring the site from cookies/Referer. Unset for `next build`,
// publish, and the live site — this block is a no-op there.
const liveAssetPrefix = process.env.WB_LIVE_ASSET_PREFIX || undefined;

const nextConfig: NextConfig = {
  output: "standalone",
  // `next dev` powers the live preview, and it compiles a route the first time
  // it is requested. The defaults keep only 5 compiled pages for 60s, so on a
  // site with many routes a page the visitor already opened is recompiled from
  // scratch when they come back to it. Dev-only: `next build` ignores this.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 100,
  },
  ...(liveAssetPrefix ? { assetPrefix: liveAssetPrefix } : {}),
  // Skip the serial tsc phase inside `next build`: the NoimosAI platform re-runs
  // the identical check with tsgo (typescript-go, ~10x faster) right after the
  // compile and still BLOCKS the build on type errors — this only moves where
  // the check runs. The marker comment arms that platform gate: noimos-type-gate
  typescript: { ignoreBuildErrors: true },
  // three.js ships untranspiled ESM (and the deep `three/examples/jsm` addons
  // that @react-three/drei pulls in). Turbopack handles node_modules ESM
  // natively, but the webpack-based `next build` / OpenNext (Cloudflare) path can
  // choke on it ("Unexpected token 'export'"). Listing it here makes the optional
  // 3d-hero stack (three + @react-three/fiber + drei, installed on demand) build
  // on every path. No-op for sites that never install three. Site agents must not
  // edit this file (.claude/rules/config-files.md) — that is why it is pre-set.
  transpilePackages: ["three"],
  // noimos-libsql-web: Kysely imports the bare client, whose Node entry pulls
  // a native SQLite loader into webpack even when the URL points to Turso.
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = { ...config.resolve.alias, "@libsql/client$": "@libsql/client/web" };
    return config;
  },
  // The live preview's dev server watches a bind-mounted tree whose writes come
  // from the host, and gVisor's gofer delivers no inotify events for those — the
  // watcher would stay silent and the editor would keep serving the previous
  // turn's bundle. webpack is told to poll through WATCHPACK_POLLING; Turbopack
  // reads this config key instead. Unset outside the preview.
  ...(process.env.WB_LIVE_WATCH_POLL_MS
    ? { watchOptions: { pollIntervalMs: Number(process.env.WB_LIVE_WATCH_POLL_MS) } }
    : {}),
  turbopack: {
    // The live preview symlinks node_modules to a shared, baked dependency tree
    // outside the project, and Turbopack refuses a symlink that escapes its
    // root — the reason the preview used to fall back to webpack, which compiles
    // a large cloned page ~37x slower (51s vs 1.4s measured). The preview passes
    // the directory that contains BOTH the project and that tree; everywhere
    // else this is the project directory, as before.
    root: process.env.WB_LIVE_TURBOPACK_ROOT || __dirname,
  },
  // Cloudflare (OpenNext) build: the per-site DB uses `@libsql/client/web`, whose
  // transitive `@libsql/isomorphic-ws` resolves `web.mjs` under the workerd
  // condition. OpenNext traces deps under the Node condition, so it would copy
  // only `node.mjs` and the workerd bundle step fails to resolve `web.mjs`. Force
  // it into the trace so esbuild can resolve it. (Version-globbed → survives
  // libsql bumps; no dependency patching needed.)
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/.pnpm/@libsql+isomorphic-ws@*/node_modules/@libsql/isomorphic-ws/*.mjs",
    ],
  },
  images: {
    // Asset URLs returned by the generate_image tool live on GCS.
    // Add additional hosts here only if you ship images from elsewhere.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      ...(assetEmulatorUrl
        ? [
            {
              protocol: assetEmulatorUrl.protocol === "https:" ? ("https" as const) : ("http" as const),
              hostname: assetEmulatorUrl.hostname,
              ...(assetEmulatorUrl.port ? { port: assetEmulatorUrl.port } : {}),
            },
          ]
        : []),
    ],
    // Next 16 blocks /_next/image fetches from local IPs by default — required
    // for the emulator host above.
    ...(assetEmulatorUrl ? { dangerouslyAllowLocalIP: true } : {}),
    // assetPrefix does not cover the image optimizer endpoint — prefix it too
    // so live-preview /_next/image requests are path-scoped like other assets.
    ...(liveAssetPrefix ? { path: `${liveAssetPrefix}/_next/image` } : {}),
  },
  // Baseline security response headers for every generated site. Site agents
  // cannot edit this file (.claude/rules/config-files.md), so shipping the
  // baseline here is the only place it can live. Deliberately CONTENT-AGNOSTIC:
  // no restrictive Content-Security-Policy or Permissions-Policy, since those
  // would break arbitrary generated sites (inline GA/pixel scripts, framer-motion,
  // next/image blobs, geolocation maps). These three are universally safe and
  // close the clickjacking / MIME-sniff / referrer-leak gaps.
  // Migration redirects. A site that replaced an existing one keeps its inbound
  // links and search ranking only if every old URL answers with a 301 to its new
  // page. The custom domain is repointed by DNS, so the old server stops
  // receiving requests the moment the site goes live — this is the only place
  // that redirect can exist. Empty for sites that never migrated.
  async redirects() {
    return loadNoimosRedirects();
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      ...searchVisibilityHeaders(),
    ];
  },
};

export default nextConfig;
