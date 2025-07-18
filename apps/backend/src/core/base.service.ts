import type { SQL } from "drizzle-orm";
import type {
  BaseModel,
  BaseRepository,
  BaseTable,
  QueryOptions,
} from "./base.repository";
import type { FilterConditions } from "./filtering";
import {
  type PaginatedData,
  type PaginationParams,
  paginate,
} from "./pagination";
import type { SortConditions } from "./sorting";

export interface ServiceQueryOptions {
  filters?: FilterConditions;
  sorts?: SortConditions;
  where?: SQL<unknown>;
}

export class BaseService<
  TRow extends BaseModel,
  Repository extends BaseRepository<TRow, BaseTable>,
> {
  protected readonly repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  async getAll(options?: ServiceQueryOptions) {
    const queryOptions: QueryOptions = {
      filters: options?.filters,
      sorts: options?.sorts,
      where: options?.where,
    };
    return this.repository.getAll(undefined, undefined, queryOptions);
  }

  async getById(id: number) {
    return this.repository.getById(id);
  }

  async create(data: Omit<TRow, "id" | "createdAt" | "updatedAt">) {
    return this.repository.create(data);
  }

  async update(id: number, data: Partial<TRow>) {
    return this.repository.update(id, data);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }

  /**
   * Get paginated results with filtering and sorting
   */
  async getAllPaginated(
    params: PaginationParams,
    options?: ServiceQueryOptions,
  ): Promise<PaginatedData<TRow>> {
    const queryOptions: QueryOptions = {
      filters: options?.filters,
      sorts: options?.sorts,
      where: options?.where,
    };
    return paginate(this.repository, params, queryOptions);
  }
}
