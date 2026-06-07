/**
 * Normalizes DATABASE_URL for @prisma/adapter-pg / node-pg.
 * pg v8 warns when sslmode is require/prefer/verify-ca without explicit verify-full.
 */
export function normalizeDatabaseUrl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode");

    if (
      !sslmode ||
      sslmode === "require" ||
      sslmode === "prefer" ||
      sslmode === "verify-ca"
    ) {
      url.searchParams.set("sslmode", "verify-full");
    }

    return url.toString();
  } catch {
    if (/sslmode=(require|prefer|verify-ca)\b/.test(connectionString)) {
      return connectionString.replace(
        /sslmode=(require|prefer|verify-ca)\b/g,
        "sslmode=verify-full",
      );
    }

    if (!/sslmode=/.test(connectionString)) {
      const separator = connectionString.includes("?") ? "&" : "?";
      return `${connectionString}${separator}sslmode=verify-full`;
    }

    return connectionString;
  }
}
