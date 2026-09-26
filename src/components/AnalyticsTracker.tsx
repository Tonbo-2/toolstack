"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Injected at build time when the owner has first-party analytics enabled
// (NEXT_PUBLIC_* → inlined into this client bundle). When unset the layout never
// renders this component, so these are always present here.
const API_BASE = process.env.NEXT_PUBLIC_ANALYTICS_API_BASE_URL;
const SITE_ID = process.env.NEXT_PUBLIC_ANALYTICS_SITE_ID;

// Built-in event names, reserved by the platform. The owner's own
// noimosTrack("signup") events are reported separately from these.
const ENGAGEMENT_EVENT = "$page_engagement";
const CTA_EVENT = "$cta_click";

declare global {
  interface Window {
    // Fire a custom event from anywhere on the site: window.noimosTrack("signup").
    noimosTrack?: (name: string) => void;
  }
}

type TargetKind = "internal" | "outbound" | "download" | "mailto" | "tel" | "button";

interface SendPayload {
  type: "pageview" | "event";
  path: string;
  name?: string;
  scrollPct?: number;
  activeSec?: number;
  target?: string;
  targetKind?: TargetKind;
}

// Ephemeral per-tab id: groups events into a "visit" and powers avg-duration.
// Lives in sessionStorage (cleared when the tab closes) — NOT a cookie, so no
// consent banner is required. Returns undefined if storage is blocked.
function getSessionId(): string | undefined {
  try {
    const KEY = "_na_sid";
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

function send(payload: SendPayload): void {
  if (!API_BASE || !SITE_ID) return;
  const url = `${API_BASE}/api/public/website/${SITE_ID}/collect`;
  const body = JSON.stringify({
    ...payload,
    query: window.location.search.replace(/^\?/, ""),
    referrer: document.referrer,
    sessionId: getSessionId(),
  });
  try {
    // text/plain keeps this a CORS "simple request" → no preflight, fire-and-forget.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
      return;
    }
  } catch {
    /* fall through to fetch */
  }
  try {
    void fetch(url, { method: "POST", body, keepalive: true, mode: "no-cors" });
  } catch {
    /* analytics must never break the page */
  }
}

const DOWNLOAD_EXT = /\.(pdf|zip|docx?|xlsx?|pptx?|csv)$/i;

/**
 * Classify a click for the `$cta_click` metric.
 *
 * Privacy by construction, the same rules the CRM tracker follows: a mailto:/tel:
 * click keeps the SCHEME and discards the address, link URLs are recorded without
 * query string or hash, and a plain button is only measured when the author opted
 * it in by name with `data-na-cta`. Nothing here reads user input.
 */
function classifyClick(el: Element): { target?: string; targetKind: TargetKind } | null {
  const named = el.getAttribute("data-na-cta");
  const anchor = el.closest("a[href]");
  if (!anchor) return named ? { target: named, targetKind: "button" } : null;

  const href = anchor.getAttribute("href") ?? "";
  if (/^mailto:/i.test(href)) return { targetKind: "mailto" };
  if (/^tel:/i.test(href)) return { targetKind: "tel" };

  try {
    const u = new URL(href, window.location.href);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    const kind: TargetKind = anchor.hasAttribute("download") || DOWNLOAD_EXT.test(u.pathname)
      ? "download"
      : u.host === window.location.host
        ? "internal"
        : "outbound";
    return { target: named ?? `${u.origin}${u.pathname}`, targetKind: named ? "button" : kind };
  } catch {
    return null;
  }
}

/**
 * First-party analytics tracker. Sends a pageview on first load and on every
 * client-side navigation, and exposes custom-event tracking two ways: the
 * `window.noimosTrack("name")` global, and a zero-code `data-na-event="name"`
 * attribute on any clickable element (delegated listener).
 *
 * It also reports two built-in metrics the edit agent reads when proposing
 * improvements, because pageview counts alone cannot say WHY a page
 * underperforms:
 *   - `$page_engagement` — furthest scroll reached and seconds actually visible,
 *     one per page view, flushed when the page is hidden or navigated away from.
 *     This is what separates "nobody visits" from "everybody leaves halfway".
 *   - `$cta_click` — clicks on links and named buttons, giving a click rate with
 *     that page's own views as the denominator.
 *
 * Both stay anonymous and aggregate: no cookie, no identifier, no form values,
 * no query strings, no email/phone addresses.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Engagement accumulator for the CURRENT page. `since` is the last moment the
  // clock was read, so time spent on a hidden tab is never counted.
  const eng = useRef<Engagement>({
    path: "",
    maxScroll: 0,
    activeMs: 0,
    since: Date.now(),
    sent: false,
    visible: true,
  });

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return; // dedupe re-renders / strict mode
    const previous = lastPath.current;
    lastPath.current = pathname;

    // The engagement of the page being LEFT belongs to that page's path, so it
    // must be flushed before the accumulator is reset for the new route.
    if (previous) flushEngagement(eng.current);
    resetEngagement(eng.current, pathname);

    send({ type: "pageview", path: pathname });
  }, [pathname]);

  useEffect(() => {
    // Keep the path the pathname effect already set — it runs first on mount and
    // uses the router's path, which excludes the preview basePath that
    // window.location carries. Only the scroll/timing state is (re)seeded here.
    resetEngagement(eng.current, eng.current.path || window.location.pathname);

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      // A page shorter than the viewport is fully seen the moment it renders —
      // reporting 0% there would drag every short page's average down.
      const pct =
        scrollable > 0
          ? Math.round(((doc.scrollTop || document.body.scrollTop || 0) / scrollable) * 100)
          : 100;
      eng.current.maxScroll = Math.max(eng.current.maxScroll, Math.min(100, Math.max(0, pct)));
    };
    const onVisibility = () => {
      tickEngagement(eng.current);
      if (document.visibilityState === "hidden") {
        flushEngagement(eng.current);
      } else if (eng.current.sent) {
        // Returning to an already-flushed page starts a fresh measurement rather
        // than resuming one — otherwise a tab left open for a day reports it.
        eng.current.maxScroll = 0;
        eng.current.activeMs = 0;
        eng.current.sent = false;
      }
    };
    const onPageHide = () => flushEngagement(eng.current);

    window.noimosTrack = (name: string) => {
      if (name) send({ type: "event", path: window.location.pathname, name });
    };
    // Child components can mount before this layout-level tracker effect. Let
    // them retry a custom event once the global tracker is actually available;
    // otherwise an A/B impression can be marked handled before it was sent.
    window.dispatchEvent(new Event("noimos-analytics-ready"));
    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest) return;

      const named = el.closest("[data-na-event]")?.getAttribute("data-na-event");
      if (named) send({ type: "event", path: window.location.pathname, name: named });

      const clickable = el.closest("a[href],[data-na-cta]");
      const cta = clickable ? classifyClick(clickable) : null;
      if (cta) {
        send({
          type: "event",
          path: window.location.pathname,
          name: CTA_EVENT,
          target: cta.target,
          targetKind: cta.targetKind,
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("click", onClick, { capture: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("click", onClick, { capture: true });
      delete window.noimosTrack;
    };
  }, []);

  return null;
}

type Engagement = {
  path: string;
  maxScroll: number;
  activeMs: number;
  since: number;
  sent: boolean;
  /**
   * Whether the tab was visible over the span `since → now`. This must be OUR
   * record, not `document.visibilityState`: a visibilitychange handler runs
   * AFTER the flip, so reading the live value attributes every span to the
   * state it just left — the visible span before hiding was banked as hidden
   * (activeSec 0 on every real exit) and the hidden span was banked as active.
   */
  visible: boolean;
};

function tickEngagement(e: Engagement): void {
  const now = Date.now();
  if (e.visible) e.activeMs += now - e.since;
  e.since = now;
  e.visible = document.visibilityState !== "hidden";
}

function resetEngagement(e: Engagement, path: string): void {
  e.path = path;
  e.maxScroll = 0;
  e.activeMs = 0;
  e.since = Date.now();
  e.sent = false;
  e.visible = document.visibilityState !== "hidden";
  // Seed the scroll depth so a page that never scrolls still reports what was
  // visible (100% for a page shorter than the viewport).
  const doc = document.documentElement;
  if (doc.scrollHeight - doc.clientHeight <= 0) e.maxScroll = 100;
}

function flushEngagement(e: Engagement): void {
  if (e.sent || !e.path) return;
  tickEngagement(e);
  const activeSec = Math.round(e.activeMs / 1000);
  // A bounce that never rendered anything is noise, not engagement data.
  if (activeSec < 1 && e.maxScroll < 5) return;
  e.sent = true;
  send({
    type: "event",
    path: e.path,
    name: ENGAGEMENT_EVENT,
    scrollPct: e.maxScroll,
    activeSec,
  });
}
