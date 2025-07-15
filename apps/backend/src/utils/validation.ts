import type { Context, ValidationTargets } from "hono";
import type { $ZodError } from "zod/v4/core";

import { ValidationError } from "./app-errors";
import type { ErrorDetails } from "../core/response.schema";

export interface ValidationErrorDetail {
  path: string;
  message: string;
  code: string;
}

export interface ValidationErrorResponse {
  success: false;
  error: {
    name: string;
    message: string;
    details: ValidationErrorDetail[];
  };
}

type ResultType<T> =
  | ({
      success: true;
      data: T;
    } & { target: keyof ValidationTargets })
  | ({
      success: false;
      error: $ZodError<unknown>;
      data: T;
    } & { target: keyof ValidationTargets });

/**
 * Create a validation hook function for zValidator that formats errors consistently
 */
export function createValidationHook(customMessage?: string) {
  return (result: ResultType<unknown>, c: Context) => {
    if (!result.success && result.error) {
      const details: ErrorDetails[] = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
        input: issue.input,
      }));

      const errorResponse = new ValidationError(
        "Invalid details",
        null,
        details,
      );

      return errorResponse.getJsonResponse(c);
    }
  };
}
