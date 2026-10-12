import Script from "next/script";

const SITE_KEY = process.env.NEXT_PUBLIC_NOIMOS_CRM_SITE_KEY;
const CRM_BASE = process.env.NEXT_PUBLIC_NOIMOS_CRM_BASE_URL;

/**
 * CRM の計測スクリプト（ページビューはこのスクリプト自身が送ります）。
 * 鍵は公開値で、管理画面の「CRM」で有効にするとビルド時に注入されます。
 * 鍵が無い・形が違うときは何も出しません（空の script タグを残さないため）。
 * 鍵は `sk_` + 32桁の16進数以外を弾いてから URL に埋め込みます。
 */
export function CrmTracking() {
  if (!SITE_KEY || !/^sk_[a-f0-9]{32}$/.test(SITE_KEY) || !CRM_BASE) return null;
  return (
    <Script
      src={`${CRM_BASE}/trackingScript?k=${SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}
