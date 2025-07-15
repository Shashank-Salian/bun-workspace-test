import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  type ErrorDetails,
  ErrorResponse,
  StandardResponse,
} from "../core/response.schema";

export enum AppErrorCodes {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  CONFLICT = "CONFLICT",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class AppError extends Error {
  public readonly statusCode: ContentfulStatusCode;
  public readonly response: StandardResponse<null>;
  public readonly errorObject: Error | undefined | null;

  constructor(
    message = "Internal server error",
    statusCode: ContentfulStatusCode = 500,
    code?: AppErrorCodes,
    errorObject?: Error | null,
    details?: ErrorDetails[] | null,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.response = new StandardResponse(
      false,
      message,
      statusCode,
      null,
      new ErrorResponse(
        code || AppErrorCodes.INTERNAL_SERVER_ERROR,
        message,
        details,
      ),
    );
    this.errorObject = errorObject;
  }

  public getJsonResponse(c: Context) {
    return c.json(this.response, this.statusCode);
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(
      message,
      500,
      AppErrorCodes.INTERNAL_SERVER_ERROR,
      errorObject,
      details,
    );
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(message, 422, AppErrorCodes.BAD_REQUEST, errorObject, details);
  }
}

export class NotFoundError extends AppError {
  constructor(
    resource: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(
      `${resource} not found`,
      404,
      AppErrorCodes.NOT_FOUND,
      errorObject,
      details,
    );
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(message, 409, AppErrorCodes.CONFLICT, errorObject, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(message, 401, AppErrorCodes.UNAUTHORIZED, errorObject, details);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(message, 400, AppErrorCodes.BAD_REQUEST, errorObject, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(message, 403, AppErrorCodes.FORBIDDEN, errorObject, details);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string,
    errorObject?: Error | null,
    details?: ErrorDetails[],
  ) {
    super(
      message,
      500,
      AppErrorCodes.INTERNAL_SERVER_ERROR,
      errorObject,
      details,
    );
  }
}
