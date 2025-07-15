import type { SQL } from "drizzle-orm";
import { z } from "zod/v4";
import type { BaseModel, BaseRepository } from "./base.repository";
import { type ErrorResponse, StandardResponse } from "./response.schema";

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int("Invalid page number").default(1),
  pageSize: z.coerce.number().int("Invalid page size").default(10),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  //   startIndex: number;
  //   endIndex: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

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

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

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
  currentPage: number,
  itemsPerPage: number,
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  //   const startIndex = (currentPage - 1) * itemsPerPage + 1;
  //   const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    // startIndex: totalItems > 0 ? startIndex : 0,
    // endIndex: totalItems > 0 ? endIndex : 0,
  };
}

/**
 * Generic paginate method that works with any BaseRepository
 */
export async function paginate<T extends BaseModel>(
  repository: BaseRepository<T>,
  params: PaginationParams,
  whereCondition?: SQL<unknown>,
): Promise<PaginatedData<T>> {
  const { page, pageSize, offset } = normalizePaginationParams(params);

  // Get total count and items in parallel for better performance
  const [totalItems, items] = await Promise.all([
    repository.count(whereCondition),
    repository.getAll(pageSize, offset, whereCondition),
  ]);

  const meta = calculatePaginationMeta(totalItems, page, pageSize);

  return {
    items,
    meta,
  };
}
