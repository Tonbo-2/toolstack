/**
 * ブラウザ側の CRM 連携（イベント計測スクリプトは src/components/CrmTracking.tsx）。
 * `identify` を呼ばないと、それ以前のイベントは匿名のままで、連絡先に紐づきません。
 * このサイトでメールアドレスが分かるのは、お問い合わせ（/about のフォーム）の
 * 送信が成功したときだけなので、そこから呼びます。
 */

declare global {
  interface Window {
    noimosCdp?: {
      /** メールアドレスのみ。ブラウザからは名前などを添えられません（サーバー側で送ります）。 */
      identify: (email: string) => void;
      event: (name: string, props?: Record<string, unknown>) => void;
    };
  }
}

/**
 * 分かったメールアドレスを CRM の連絡先に結びつける。
 * スクリプトは afterInteractive で読み込まれるため、まだ無ければ少しだけ待つ
 * （初回表示の時点で無くても取りこぼさないようにするため）。
 */
export function identifyCrm(email: string): void {
  if (typeof window === "undefined" || !email) return;
  let tries = 0;
  const id = window.setInterval(() => {
    if (window.noimosCdp) {
      window.noimosCdp.identify(email);
      window.clearInterval(id);
    } else if (++tries > 20) {
      window.clearInterval(id);
    }
  }, 250);
}
