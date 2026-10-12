import "server-only";

const apiUrl = process.env.NOIMOS_WEBSITE_API_URL;
const websiteId = process.env.NOIMOS_WEBSITE_ID;
const token = process.env.NOIMOS_WEBSITE_EMAIL_TOKEN;
// メールはこの3つが揃ったときだけ有効（管理画面の「メール」で有効にするとビルド時に注入されます）。
const emailEnabled = Boolean(apiUrl && websiteId && token);

type EmailBody = { subject: string; html: string; replyTo?: string };

async function gatewayPost(path: string, body: unknown): Promise<Response | null> {
  if (!emailEnabled) return null;
  try {
    return await fetch(`${apiUrl}/api/public/website/${websiteId}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-noimos-website-token": token! },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    // 送れないときは静かに null を返す（呼び出し側の処理は止めません）。
    return null;
  }
}

/** サイトの運営者に知らせる。宛先は管理画面で設定したアドレスなので、こちらからは指定しません。 */
export async function sendOwnerNotification(body: EmailBody): Promise<boolean> {
  const res = await gatewayPost("/email/send", { kind: "notify", ...body });
  return Boolean(res?.ok);
}

/**
 * 送信した本人に受付確認を送る。`to` はこのリクエストで検証済みのアドレスだけを
 * 渡すこと（フォームが検証したメールアドレスなど）。未検証の値をそのまま渡さない。
 * 宛先ごとの許可（grant）を取ってから送ります。
 */
export async function sendVisitorAutoresponder(to: string, body: EmailBody): Promise<boolean> {
  const granted = await gatewayPost("/email/grant", { to });
  if (!granted?.ok) return false;
  const { grant } = (await granted.json().catch(() => ({}))) as { grant?: string };
  if (!grant) return false;
  const res = await gatewayPost("/email/send", { kind: "autoresponder", to, grant, ...body });
  return Boolean(res?.ok);
}
