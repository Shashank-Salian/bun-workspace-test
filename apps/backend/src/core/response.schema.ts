import type { BaseModel, BaseRepository } from "./base.repository";

export interface ErrorDetails {
  [key: string]: unknown;
}

export class ErrorResponse {
  public code: string;
  public message: string;
  public details: ErrorDetails[] | null;

  constructor(
    code: string,
    message: string,
    details: ErrorDetails[] | null = null,
  ) {
    this.code = code;
    this.message = message;
    this.details = details;
  }
}

export class StandardResponse<T> {
  public success: boolean;
  public message: string;
  public statusCode: number;
  public data: T | null;
  public errors: ErrorResponse | null;

  constructor(
    success: boolean,
    message: string,
    statusCode: number,
    data: T | null = null,
    errors: ErrorResponse | null = null,
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
  }
}
