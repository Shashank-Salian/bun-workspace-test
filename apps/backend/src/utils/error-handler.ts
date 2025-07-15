import { DrizzleQueryError } from "drizzle-orm/errors";
import { AppErrorCodes, DatabaseError } from "./app-errors";

const PG_ERROR_CODES = {
  "23503": {
    key: "foreign_key_violation",
    message: (field = "", value = "") =>
      `The ${field ? field : "value"} ${value ?? value} does not exist`,
    code: AppErrorCodes.BAD_REQUEST,
  },
  "23505": {
    key: "unique_violation",
    message: (field = "", value = "") =>
      `The ${field ? field : "value"} ${value ?? value} already exists`,
    code: AppErrorCodes.BAD_REQUEST,
  },
  "23502": {
    key: "not_null_violation",
    message: (field = "") =>
      field ? `${field} is required` : "Some fields are missing",
    code: AppErrorCodes.BAD_REQUEST,
  },
} as const;

export function getDatabaseError(err: DrizzleQueryError) {
  if (err.cause && "code" in err.cause) {
    let value: string | undefined;
    let field: string | undefined;
    let knownError = false;
    if ("detail" in err.cause && typeof err.cause.detail === "string") {
      const details = parsePostgresDetail(err.cause.detail);
      value = details?.columnValue;
      field = details?.columnName;
      knownError = true;
    }

    return new DatabaseError(
      PG_ERROR_CODES[err.cause.code as keyof typeof PG_ERROR_CODES]?.message(
        field,
        value,
      ) || "Something went wrong! Please try again later.",
      err,
      PG_ERROR_CODES[err.cause.code as keyof typeof PG_ERROR_CODES]?.code ||
        AppErrorCodes.INTERNAL_SERVER_ERROR,
      knownError ? 400 : 500,
    );
  }

  return new DatabaseError(
    "Something went wrong! Please try again later.",
    err,
    AppErrorCodes.INTERNAL_SERVER_ERROR,
    500,
  );
}

export function parsePostgresDetail(detailMessage: string) {
  const parensRegex = /\((.*?)\)/g;
  const quotesRegex = /"([^"]+)"/;

  const parenMatches = [...detailMessage.matchAll(parensRegex)];
  const quotedMatch = detailMessage.match(quotesRegex);

  if (parenMatches.length < 2) return null;

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
