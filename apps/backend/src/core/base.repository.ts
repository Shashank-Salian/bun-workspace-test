import type { SQL } from "drizzle-orm";
import type { PgQueryResultHKT, PgTransaction } from "drizzle-orm/pg-core";
import type { FilterConditions } from "./filtering";
import type { SortConditions } from "./sorting";

export interface BaseModel {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryOptions {
  filters?: FilterConditions;
  sorts?: SortConditions;
  where?: SQL<unknown>;
}

export abstract class BaseRepository<S extends BaseModel> {
  abstract getAll(
    limit?: number,
    offset?: number,
    options?: QueryOptions,
  ): Promise<S[]>;
  abstract getById(id: number): Promise<S | null>;
  abstract getById<TColumns extends { [key in keyof S]?: true }>(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof S ? S[K] : never;
      }
    | null
  >;
  abstract create(data: Omit<S, "id" | "createdAt" | "updatedAt">): Promise<S>;
  abstract create(
    data: Omit<S, "id" | "createdAt" | "updatedAt">,
    tx: PgTransaction<PgQueryResultHKT>,
  ): Promise<S>;
  abstract update(id: number, data: Partial<S>): Promise<S>;
  abstract delete(id: number): Promise<void>;
  abstract count(options?: QueryOptions): Promise<number>;
}
