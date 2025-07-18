import { z } from "zod/v4";
import type {
  BaseModel,
  BaseRepository,
  BaseTable,
  QueryOptions,
} from "./base.repository";
import { type ErrorResponse, StandardResponse } from "./response.schema";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const paginationParamsSchema = z.object({
  page: z.coerce
    .number({ error: "Page must be a number" })
    .int()
    .min(1, { error: "Min allowed page is 1" })
    .default(1),
  pageSize: z.coerce
    .number({ error: "Page size must be a number" })
    .int()
    .min(1, { error: "Min allowed page size is 1" })
    .max(50, { error: "Max allowed page size is 50" })
    .default(10),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export interface PaginationMeta {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type PaginatedData<T> = {
  items: T[];
} & PaginationMeta;

export class PaginatedResponse<T> extends StandardResponse<PaginatedData<T>> {
  constructor(
    success: boolean,
    message: string,
    statusCode: number,
    data: PaginatedData<T> | null = null,
    errors: ErrorResponse | null = null,
  ) {
    super(success, message, statusCode, data, errors);
  }
}

/**
 * Normalize pagination parameters
 */
export function normalizePaginationParams(params: PaginationParams): {
  page: number;
  pageSize: number;
  offset: number;
} {
  const page = Math.max(1, params.page || DEFAULT_PAGE);
  const pageSize = Math.min(
    Math.max(1, params.pageSize || DEFAULT_LIMIT),
    MAX_LIMIT,
  );
  const offset = (page - 1) * pageSize;

  return { page, pageSize, offset };
}

/**
 * Calculate pagination metadata
 */
export function calculatePaginationMeta(
  totalItems: number,
  page: number,
  pageSize: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    page,
    totalPages,
    totalItems,
    pageSize,
    hasNext,
    hasPrevious,
  };
}

/**
 * Generic paginate method that works with any BaseRepository
 */
export async function paginate<T extends BaseModel>(
  repository: BaseRepository<T, BaseTable>,
  params: PaginationParams,
  options?: QueryOptions,
): Promise<PaginatedData<T>> {
  const { page, pageSize, offset } = normalizePaginationParams(params);

  // Get total count and items in parallel for better performance
  const [totalItems, items] = await Promise.all([
    repository.count(options),
    repository.getAll(pageSize, offset, options),
  ]);

  const meta = calculatePaginationMeta(totalItems, page, pageSize);

  return {
    items,
    ...meta,
  };
}
