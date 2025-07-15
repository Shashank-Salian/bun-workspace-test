export interface ErrorResponse {
  success: false;
  errors: {
    name: string;
    code: string;
    message: string;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
