import { NextResponse } from "next/server";
import { z } from "zod";
import { db, NoDatabaseError } from "@/lib/db";
import { crmTrack } from "@/lib/crmServer";
import { sendOwnerNotification, sendVisitorAutoresponder } from "@/lib/email";

const leadSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  source: z.string().max(500).optional(),
  hp: z.string().optional(), // honeypot — real people leave this empty
});

// メール本文に差し込む値が HTML として解釈されないように実体参照へ直す。
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  // Bot caught by the honeypot — pretend success, store nothing.
  if (parsed.data.hp) return NextResponse.json({ ok: true });

  const { name, email, company, message, source } = parsed.data;

  // 保存が先。テーブルは src/lib/schema-migrations.json が作り、ここは DML だけ。
  // DB が無いときは 503 を返し、成功に見せかけない。
  try {
    await db.execute({
      sql: "INSERT INTO leads (name, email, company, message, source) VALUES (?, ?, ?, ?, ?)",
      args: [name ?? null, email, company ?? null, message ?? null, source ?? null],
    });
  } catch (e) {
    if (e instanceof NoDatabaseError) {
      return NextResponse.json({ ok: false, error: "Storage not ready" }, { status: 503 });
    }
    throw e;
  }

  // メール通知（管理画面の「メール」で有効にしたときだけ送られ、未設定なら何もしない）。
  // 保存済みのリードが正なので、メールが失敗しても送信は成功のまま返す。
  try {
    const lines = [
      name ? `お名前: ${esc(name)}` : null,
      `メールアドレス: ${esc(email)}`,
      company ? `会社名: ${esc(company)}` : null,
      source ? `ページ: ${esc(source)}` : null,
      message ? `\n${esc(message)}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    await sendOwnerNotification({
      subject: "【ToolStack】お問い合わせが届きました",
      html: `<pre>${lines}</pre>`,
      replyTo: email,
    });
    await sendVisitorAutoresponder(email, {
      subject: "お問い合わせを受け付けました（ToolStack）",
      html: `<p>お問い合わせありがとうございます。内容を確認します。</p><p>このメールは自動送信です。</p>`,
    });
  } catch {
    // メールの失敗でリード保存を壊さない
  }

  // CRM へ「問い合わせが届いた」ことを記録する（管理画面の「CRM」で連携を
  // 有効にしたときだけ送られ、未設定なら crmTrack は何もせず false を返す）。
  // 保存が済んだあとに呼び、失敗しても送信そのものは成功のまま返す。
  const tracked = await crmTrack(
    email,
    "form_submitted",
    { source: source ?? "/about" },
    { traits: { name, company }, messageId: crypto.randomUUID() },
  );
  if (!tracked) console.warn("[crm] form_submitted not recorded");

  return NextResponse.json({ ok: true });
}
