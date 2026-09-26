import "server-only";
import { createClient, type Client } from "@libsql/client/web";

/**
 * Per-site database client — driver-adaptive, one connected DB per site.
 *
 * The platform injects exactly ONE datastore, and this client adapts to it:
 *  - `TURSO_DATABASE_URL` (+ `TURSO_AUTH_TOKEN`): the managed Turso DB or an
 *    external libSQL/Turso DB → uses `@libsql/client` (SQLite dialect, runs on
 *    the edge / Cloudflare Workers too).
 *  - `DATABASE_URL` = `postgres://…`: an external Postgres DB → uses
 *    node-postgres (`pg`, Node runtime only).
 *
 * Both expose the SAME minimal API — `db.execute()` + `db.batch()` returning
 * `{ rows }` — so DML (INSERT/SELECT/UPDATE/DELETE) is dialect-agnostic. Write
 * placeholders as `?` (rewritten to `$1,$2,…` for Postgres). DDL TYPES differ per
 * dialect, so branch table creation on `dbDialect` (see the `database` skill).
 * Better Auth manages its own tables per dialect via its migrate.
 *
 *   import { db, dbDialect } from "@/lib/db";
 *   await db.execute({ sql: "INSERT INTO leads (email) VALUES (?)", args: [email] });
 *   // Type reads at the boundary with the generic (no `as` cast needed):
 *   type Lead = { id: number; email: string; created_at: string };
 *   const { rows } = await db.execute<Lead>("SELECT * FROM leads ORDER BY id DESC");
 */

export type DbDialect = "sqlite" | "postgres";

/** Which engine backs this site, decided from the injected env at load. */
export const dbDialect: DbDialect = (process.env.DATABASE_URL ?? "").startsWith("postgres")
  ? "postgres"
  : "sqlite";

export type DbValue = string | number | boolean | bigint | Uint8Array | Date | null;
export interface DbStatement {
  sql: string;
  args?: DbValue[];
}

/** One returned row. Generic so callers can type reads at the trust boundary. */
export type DbRow = Record<string, unknown>;

// Read generics are constrained to `object`, NOT to `DbRow`. A TS `interface` gets
// no implicit index signature, so `interface Row { id: string }` does not satisfy
// `Record<string, unknown>` — `db.execute<Row>(…)` would fail the build with
// "Index signature for type 'string' is missing in type 'Row'", which is how most
// callers naturally declare a row type. `DbRow` stays the default so an untyped
// read still yields indexable rows.

export interface DbResult<T extends object = DbRow> {
  rows: T[];
}

/**
 * Thrown when a DB operation runs but no database is provisioned/injected for
 * this site (no `TURSO_DATABASE_URL`, no Postgres `DATABASE_URL`). Fail LOUD so
 * a route returns a real 5xx instead of an opaque client error — a swallowed
 * write is how a form reports success while the lead was actually dropped.
 */
export class NoDatabaseError extends Error {
  constructor() {
    super(
      "No database is provisioned for this site. The platform injects " +
        "TURSO_DATABASE_URL / DATABASE_URL on the next build once a database is " +
        "connected — provision one before reading or writing data.",
    );
    this.name = "NoDatabaseError";
  }
}

export interface Db {
  execute<T extends object = DbRow>(stmt: string | DbStatement): Promise<DbResult<T>>;
  /** Run statements in order inside a single transaction. */
  batch<T extends object = DbRow>(stmts: (string | DbStatement)[]): Promise<DbResult<T>[]>;
}

const toStmt = (s: string | DbStatement): DbStatement => (typeof s === "string" ? { sql: s } : s);

// Postgres binds with $1,$2,…; rewrite the libSQL-style `?` placeholders, leaving
// any `?` inside quoted string literals untouched. A doubled quote ('' / "") is
// an escaped literal quote, not a string close.
//
// JSONB operators: Postgres uses `?|` and `?&` (existence-of-any / -all) and the
// escape `??` for a literal `?`. Those are emitted verbatim, never as a bind — so
// `WHERE data ?| array['a','b']` survives. The single-`?` existence operator
// (`data ? 'k'`) is indistinguishable from a placeholder; write it as
// `jsonb_exists(data, 'k')` on Postgres.
function toPgQuery(sql: string): string {
  let out = "";
  let quote: string | null = null;
  let n = 0;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (quote) {
      out += ch;
      if (ch === quote) {
        if (sql[i + 1] === quote) {
          out += sql[i + 1];
          i++;
        } else {
          quote = null;
        }
      }
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      out += ch;
    } else if (ch === "?") {
      const next = sql[i + 1];
      if (next === "|" || next === "&") {
        // JSONB existence operator ?| / ?& — emit literally, not a bind.
        out += ch + next;
        i++;
      } else if (next === "?") {
        // ?? — Postgres escape for a literal ? operator; collapse to one.
        out += "?";
        i++;
      } else {
        out += `$${++n}`;
      }
    } else {
      out += ch;
    }
  }
  return out;
}

function libsqlDb(): Db {
  // Built on first use: the web client validates its URL eagerly, and the
  // Cloudflare/OpenNext `next build` runs with no TURSO_* env.
  let client: Client | undefined;
  const c = () => {
    const url = process.env.TURSO_DATABASE_URL;
    // No DB injected — fail loud so the route returns a real 5xx instead of an
    // opaque client error (a swallowed write is how a form fakes success).
    if (!url) throw new NoDatabaseError();
    return (client ??= createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN }));
  };
  return {
    async execute<T extends object = DbRow>(s: string | DbStatement) {
      const r = await c().execute(toStmt(s));
      return { rows: r.rows as DbRow[] as T[] };
    },
    async batch<T extends object = DbRow>(stmts: (string | DbStatement)[]) {
      const rs = await c().batch(stmts.map(toStmt));
      return rs.map((r) => ({ rows: r.rows as DbRow[] as T[] }));
    },
  };
}

function postgresDb(): Db {
  // node-postgres is Node-only — imported lazily so the libSQL / edge path (and
  // edge builds) never load it.
  let poolP: Promise<import("pg").Pool> | undefined;
  const pool = () =>
    (poolP ??= import("pg").then(
      ({ Pool }) => new Pool({ connectionString: process.env.DATABASE_URL }),
    ));
  return {
    async execute<T extends object = DbRow>(s: string | DbStatement) {
      const { sql, args } = toStmt(s);
      const res = await (await pool()).query(toPgQuery(sql), args ?? []);
      return { rows: res.rows as DbRow[] as T[] };
    },
    async batch<T extends object = DbRow>(stmts: (string | DbStatement)[]) {
      const client = await (await pool()).connect();
      try {
        await client.query("BEGIN");
        const out: DbResult<T>[] = [];
        for (const s of stmts) {
          const { sql, args } = toStmt(s);
          out.push({ rows: (await client.query(toPgQuery(sql), args ?? [])).rows as DbRow[] as T[] });
        }
        await client.query("COMMIT");
        return out;
      } catch (e) {
        await client.query("ROLLBACK").catch(() => {});
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

let impl: Db | undefined;
const resolve = (): Db => (impl ??= dbDialect === "postgres" ? postgresDb() : libsqlDb());

/** Shared per-site DB client. Resolution is deferred to first use. */
export const db: Db = {
  execute: <T extends object = DbRow>(s: string | DbStatement) => resolve().execute<T>(s),
  batch: <T extends object = DbRow>(s: (string | DbStatement)[]) => resolve().batch<T>(s),
};
