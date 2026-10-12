import "server-only";

const apiUrl = process.env.NOIMOS_WEBSITE_CRM_API_URL;
const token = process.env.NOIMOS_WEBSITE_CRM_TOKEN;

export interface CrmTrackOptions {
  /** その人について分かっていること（名前・会社・プランなど）。連絡先に反映されます。 */
  traits?: Record<string, unknown>;
  /** この操作の安定したID（ユーザーID・注文IDなど）。再送しても1回と数えます。 */
  messageId?: string;
}

/**
 * `email` の人が `event` を行ったことを CRM に記録する。連絡先が無ければ作り、
 * 分かっている情報で更新する。`url` にはこのサイトの公開URLを入れ、CRM が
 * 「このサイトから届いた」と確認できるようにする。CRM が受け取ったときだけ true。
 *
 * CRM 連携が有効なときだけビルド時に注入される2つのサーバー専用の値を使います。
 * 未設定なら何もせず false を返すので、呼び出し側の処理を止めません。
 */
export async function crmTrack(
  email: string,
  event: string,
  properties: Record<string, unknown> = {},
  options: CrmTrackOptions = {},
): Promise<boolean> {
  if (!apiUrl || !token) return false;
  try {
    const res = await fetch(`${apiUrl}/v1/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        batch: [
          { type: "identify", userId: email, traits: { ...options.traits, email } },
          {
            type: "track",
            userId: email,
            event,
            // イベントごとに分ける（1件の操作から複数のイベントが出ても衝突しない）。
            messageId: `${event}:${options.messageId ?? crypto.randomUUID()}`,
            timestamp: new Date().toISOString(),
            properties: { url: process.env.NEXT_PUBLIC_SITE_URL, ...properties },
          },
        ],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
