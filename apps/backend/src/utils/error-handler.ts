import { DrizzleQueryError } from "drizzle-orm/errors";

const PG_ERROR_CODES = {
  "23503": {
    key: "foreign_key_violation",
    message: (value = "") => `The value ${value} does not exist`,
  },
  "23505": {
    key: "unique_violation",
    message: (value = "") => `The value ${value} already exists`,
  },
  "23502": {
    key: "not_null_violation",
    message: (value = "") =>
      value ? `${value} is required` : "Some fields are missing",
  },
} as const;

export function getPgErrorMessageByCode(err: DrizzleQueryError) {
  if (err.cause && "code" in err.cause) {
    let value: string | undefined;
    if ("detail" in err.cause && typeof err.cause.detail === "string") {
      const details = parsePostgresDetail(err.cause.detail);
      if (details) value = details.columnValue;
    }

    return (
      PG_ERROR_CODES[err.cause.code as keyof typeof PG_ERROR_CODES]?.message(
        value,
      ) || "Something went wrong! Please try again later."
    );
  }
}

export function parsePostgresDetail(detailMessage: string) {
  const parensRegex = /\((.*?)\)/g;
  const quotesRegex = /"([^"]+)"/;

  const parenMatches = [...detailMessage.matchAll(parensRegex)];
  const quotedMatch = detailMessage.match(quotesRegex);

  if (parenMatches.length < 2 || !quotedMatch) return null;

  return {
    columnName: parenMatches[0]?.[1] || undefined,
    columnValue: parenMatches[1]?.[1] || undefined,
    tableName: quotedMatch?.[1] || undefined,
  };
}

export function isConstraintError(err: unknown, constraint: string) {
  if (
    err instanceof DrizzleQueryError &&
    err.cause &&
    // "code" in err.cause &&
    // typeof err.cause.code === "string" &&
    // err.cause.code in PG_ERROR_CODES &&
    "constraint" in err.cause &&
    err.cause.constraint === constraint
  ) {
    return true;
  }

  return false;
}
