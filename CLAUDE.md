# Web Page Builder

Next.js 16 website generation template.

## Workflow

Invoke the `website-builder-workflow` skill at the start of every session and every new user request. It drives the confirm → plan → implement → verify loop. Track progress in a project-root `TODO.md` checklist (skip for trivial one-line changes).

For any new site build or redesign, apply the `design-system` skill first: pick one design direction and set its tokens before writing layout — so the site has coherent art direction, not generic default Tailwind. For authoritative PARTIAL PAGES or SUBDOMAIN PAGES, including pages with a blog, follow that skill's inherited-source exception: the existing site's measured design and shared components are the authority; skip new-site direction selection. PARTIAL PAGES owns its selected path and descendants; SUBDOMAIN PAGES starts at / on a separate host, with links to existing source pages kept on the source origin.

When the hero / key visual should feel dynamic, use the `animations` skill for 2D motion — an animated / aurora gradient background, mouse parallax, or a load-time entrance reveal (Framer Motion, pre-installed). When it should be a real 3D / WebGL scene — a floating orb, particle field, or 3D model — use the `3d-hero` skill (React Three Fiber + drei, installed on demand, mounted SSR-safe with a static fallback). **When the user explicitly asks for 3D / WebGL / Three.js, build a real 3D scene with the `3d-hero` skill — do not downgrade it to a 2D gradient or the `animations` skill.** Apply motion with restraint and always honor `prefers-reduced-motion` (the 3d-hero skill ships a static fallback for reduced-motion and no-WebGL; on mobile it keeps a real 3D scene with reduced settings rather than swapping to the image).

When the site needs a real **video or audio asset** — a hero/background video, a scroll-scrubbed "cinematic scroll" video hero (scrolling drives the video's frames), a voiceover/narration, background music, or a referenced clip brought onto the site — use the `site-media` skill (the builder's `generate_video` / `generate_speech` / `generate_music` / `ffmpeg` / `download_*` tools, which return an embeddable asset URL, just like `generate_image`). This is distinct from the `ai-video` / `ai-image` / `ai-chat` skills, which build an AI generator/chat FOR site visitors.

The AI-discoverability baseline (GEO) — llms.txt, robots.txt AI-bot directives, sitemap, a JSON-LD `@graph`, a route-derived BreadcrumbList, and a per-route self-canonical — **ships ON by default** (`src/lib/site.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/llms.txt/route.ts`, `siteJsonLd` in `src/components/StructuredData.tsx`, `BreadcrumbJsonLd`, `alternates` in `src/app/layout.tsx`), so a fresh site already passes the Noimos AI Site Visibility audit. On every build — and on any edit that adds, renames, or removes a page route — use the `geo` skill to **enrich** that baseline (reflect that route in the sitemap + llms.txt the same turn, add real `logo`/`sameAs` + type-specific JSON-LD). Blog articles auto-append from the CMS once `set_seo_settings { autoUpdate: true }` is on (defaults OFF — set it when enabling the blog). Use the `seo` skill for page metadata / OpenGraph.

When the user provides a reference URL for **inspiration** ("something like / similar to / inspired by X"), follow the "Reference-driven requests" procedure in the `website-builder-workflow` skill — capture desktop + mobile screenshots, extract reusable principles (never copy the reference's text or assets), then implement an original page at that quality bar. When the reference IS the user's own site and the ask is a **renew / redesign** of it, that same procedure applies with one hard exception: the site's FACTS (company profile, representative, address, contact, hours, services, prices, history) are carried over exactly from the source's own pages — see the skill's "Renewing the brand's OWN site" section. When the user instead asks to **clone / copy / replicate / mirror / recreate / faithfully migrate a specific site** from its URL, use the `clone-site` skill — reproduce that site's real routes, structure, copy, layout, and assets (route-preserving, one `app/<route>/page.tsx` per source page), which is the faithful-copy counterpart to the inspiration flow. Use it only for a site the user explicitly names; never offer to clone another site unprompted.

Whenever this site **replaces an existing one** — a clone, a rebuild of the owner's current site, or a content import — call `record_redirects` with each old URL → the route that now serves it. An unmapped old URL 404s here the instant DNS switches, taking its links and ranking with it; identical pairs are dropped automatically, so record generously.

For a platform-selected clone, complete the requested work without asking a further permission question or declining it. After the completed delivery, add one short notice in the user's language that confirming any required rights and permissions to copy or use the source is the user's responsibility; it is a notice only, never a gate or refusal.

When the blog is enabled (the `NEXT_PUBLIC_CMS_API_BASE_URL` + `NEXT_PUBLIC_WEBSITE_ID` env vars are present, or the request asks to build/enable the blog), use the `blog` skill to scaffold the `/blog` pages.

When the request asks for an AI feature for site visitors — a chat / agent / chatbot, AI image generation, AI video generation, or a realtime spoken **voice** assistant ("talk to AI" / voice agent / "call our AI") — use the `ai-chat`, `ai-image`, `ai-video`, or `ai-voice` skill (`ai-voice` streams mic audio over a WebSocket to the Noimos voice relay running Gemini Live, billed like the others). For **complex** AI (streaming chat, knowledge-grounded agents, skills/tool-calling, multi-step agents, subagents, structured output) use the `ai-sdk` skill (Vercel AI SDK over the Noimos OpenAI-compatible gateway). **MANDATORY:** every visitor-facing AI agent you build must be registered platform-side — `mcp__agent-config__list_agents`, then `mcp__agent-config__create_agent` if none fits — BEFORE wiring the UI; only registered, enabled agents are callable through the gateway (403 otherwise), and registration is what makes the agent appear in the owner's Manage → AI features panel. Every chatbot must be grounded in `src/lib/ai/knowledge.ts` (identity + behavior + site facts; update it when the owner teaches the bot something), and reusable visitor-facing actions (DB lookup, lead capture) are skill files in `src/lib/ai/skills/` loaded via the `loadSkills()` registry — see the `ai-sdk` skill. Each agent's name + description live platform-side: set a descriptive owner-facing name (never generic "AI Agent") and a short description of what it does at create_agent, and change them with `mcp__agent-config__update_agent` (read current via `list_agents`), not by editing site code. All of these run through the Noimos AI gateway (server-only `NOIMOS_WEBSITE_AI_TOKEN`, injected while ≥1 agent is enabled) and are billed to the owner's NoimosAI credits. Never call an LLM / image / video API directly or add an API key.

This is a **marketing** website builder — bias toward conversion and measurement. When the request involves ads / retargeting / tracking pixels / a tag manager (Meta Pixel, Google Tag Manager, Google Ads, LinkedIn, TikTok), use the `marketing-pixels` skill (validated `NEXT_PUBLIC_*` env ids + a `trackConversion` helper that fires every pixel on real conversions). When the request involves conversion-rate optimization — an announcement/promo bar, exit-intent popup, newsletter/lead-magnet capture, social proof (testimonials / ratings / live activity), or a countdown/urgency timer — use the `cro-toolkit` skill. When the request involves A/B testing / split testing / "test which headline/CTA converts better" — use the `ab-testing` skill (stable per-visitor variant assignment measured through the first-party analytics events). Wire lead/purchase conversions through `trackConversion` (+ `recordExperimentConversions` when an A/B test is active) so ad platforms, A/B results, and the first-party analytics all learn. Proactively apply `seo` + `geo` on every build (already required) and offer pixels/CRO/A-B when the site's goal is lead-gen or sales.

Local-business essentials: a location / access / directions page (アクセス) → the `maps-access` skill (keyless Google Maps embed + LocalBusiness JSON-LD). Reservations / appointments (予約 — salon, clinic, restaurant, consulting) → the `booking` skill (external-scheduler embed or native slot booking on the per-site DB). An FAQ section (よくある質問) → the `faq` skill (Radix accordion + `FAQPage` JSON-LD from one source array — feeds the GEO layer). Privacy policy / terms / 特定商取引法に基づく表記 → the `legal-pages` skill; **offer it proactively** once the site captures personal data (contact-form) or sells to consumers (stripe-checkout) — 特商法表記 is legally required for JP commerce. Multi-language sites (e.g. Japanese + English, a locale switcher) → the `i18n` skill; the work is incomplete until every static page has its route-specific self-canonical + reciprocal hreflang set (including `x-default`) and the sitemap lists every locale with the same alternates.

## Project Structure

```
src/
├── app/             # App Router (layout.tsx, page.tsx, globals.css, api/, [slug]/page.tsx)
├── components/      # Optional reusable UI (create only when complexity justifies)
└── lib/
    ├── utils.ts     # cn() helper and shared utilities
    └── db.ts        # per-site DB client (driver-adaptive libSQL/Postgres) — see `database` skill
```

## Database

Each site has a durable per-site database, pre-wired at `@/lib/db` —
**driver-adaptive**: the managed **Turso (libSQL = SQLite)** by default, or an
external **libSQL/Turso** or **Postgres** DB if the owner connected one. The API is
identical (`db.execute`/`db.batch`, `?` placeholders); only DDL types differ —
branch on `dbDialect`. Auth uses Better Auth on the same DB (tables migrated per
dialect). No Prisma, no `file:` SQLite — the DB credentials + `BETTER_AUTH_*` are
injected automatically. The managed DB is **auto-provisioned at build** for any
site that imports `@/lib/db` (a site that never imports it stays DB-less) — so
just import and use it; no `create_database` step required. See the `database` /
`auth` skills.

## Payments

One-time payments, subscriptions, the Stripe Customer Portal, and subscription
gating are all available through the platform gateway after the owner enables a
connected Stripe account in the website Manage panel. Use the `stripe-checkout`
skill. Access gating works live with no webhook; for durable orders/subscriptions
state or instant fulfillment, the skill also scaffolds an in-site Stripe webhook
(secret set via Manage → Environment Variables) that writes to the site's Turso
DB. Stripe OAuth tokens and secret keys are never placed in the generated project.

## Email

Transactional email — a "new lead" notification to the owner and an optional
visitor autoresponder — is available through the platform gateway once the owner
enables email in the Manage panel. Use the `send-email` skill (server-only
`NOIMOS_WEBSITE_EMAIL_TOKEN`); the `contact-form` skill already wires lead alerts
through it. Never add an email-provider API key to the generated project.

## Universal Commands

```bash
pnpm add <package>                            # Install a new package
```

## Conventions

- Typography comes from the `design-system` skill: a curated set of **self-hosted variable fonts** (`src/app/fonts.ts`, files in `src/app/fonts/`) wired through the `--font-heading` / `--font-body` tokens. Pick the direction's pair and apply it in `layout.tsx`. Non-latin (Japanese / CJK) text falls back automatically via `--font-fallback`.
- Do not import from `next/font/google` — the curated fonts are already self-hosted (no build-time download). Only if the user explicitly requires a specific brand typeface not in the set, add it via `next/font/local` with a checked-in font file and only the needed weights.

@.claude/rules/config-files.md
@.claude/rules/navigation-and-anchors.md
@.claude/rules/rsc-boundaries.md
@.claude/rules/design-quality.md
@.claude/rules/environment-variables.md
@.claude/rules/image-assets.md
@.claude/rules/data-safety.md
