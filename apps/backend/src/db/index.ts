import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import { Pool } from "pg";
import * as schema from "../schemas";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle({ client: pool, schema });

export function getDb(): NodePgDatabase<typeof schema> & {
  $client: Pool;
};
export function getDb(tx?: PgTransaction<PgQueryResultHKT>):
  | PgTransaction<PgQueryResultHKT>
  | (NodePgDatabase<typeof schema> & {
      $client: Pool;
    });

export function getDb(tx?: PgTransaction<PgQueryResultHKT>) {
  if (tx) {
    return tx;
  }

  return db;
}

export default db;
