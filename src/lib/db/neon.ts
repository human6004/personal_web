import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type SqlClient = Pick<NeonQueryFunction<false, false>, "query">;

let cachedSql: SqlClient | null = null;
let testSql: SqlClient | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function getSql(): SqlClient {
  if (testSql) {
    return testSql;
  }

  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!cachedSql) {
    cachedSql = neon(connectionString);
  }

  return cachedSql;
}

export async function dbQuery<T extends Record<string, unknown>>(
  query: string,
  params: unknown[] = []
) {
  return getSql().query(query, params) as Promise<T[]>;
}

export function setSqlForTests(sql: SqlClient | null) {
  testSql = sql;
}

export function resetSqlForTests() {
  testSql = null;
  cachedSql = null;
}
