import { NextResponse } from "next/server";
import { z } from "zod";
import { db, dbDialect } from "@/lib/db";

// Only the auto-increment id + timestamp differ between SQLite and Postgres.
const ID =
  dbDialect === "postgres" ? "id BIGSERIAL PRIMARY KEY" : "id INTEGER PRIMARY KEY AUTOINCREMENT";
const CREATED_AT =
  dbDialect === "postgres"
    ? "created_at TIMESTAMPTZ DEFAULT now()"
    : "created_at TEXT DEFAULT CURRENT_TIMESTAMP";

const leadSchema = z.object({
  name: z.string().max(200).optional(),
  email: z.string().email().max(320),
  company: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
  source: z.string().max(500).optional(),
  hp: z.string().optional(), // honeypot — real people leave this empty
});

export async function POST(request: Request) {
  const parsed = leadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  // Bot caught by the honeypot — pretend success, store nothing.
  if (parsed.data.hp) return NextResponse.json({ ok: true });

  const { name, email, company, message, source } = parsed.data;
  await db.execute(
    `CREATE TABLE IF NOT EXISTS leads (
       ${ID},
       name TEXT, email TEXT NOT NULL, company TEXT, message TEXT, source TEXT,
       ${CREATED_AT}
     )`,
  );
  await db.execute({
    sql: "INSERT INTO leads (name, email, company, message, source) VALUES (?, ?, ?, ?, ?)",
    args: [name ?? null, email, company ?? null, message ?? null, source ?? null],
  });

  // Notification email is intentionally not wired yet: the platform's email
  // gateway is off until the owner enables Email in Manage → Email. Once it is,
  // add the `@/lib/email` helpers here (owner alert + visitor confirmation) —
  // the DB row above stays the source of truth either way.
  return NextResponse.json({ ok: true });
}
