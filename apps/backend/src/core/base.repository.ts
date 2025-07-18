import { and, eq, sql, type SQL } from "drizzle-orm";
import type {
  AnyPgTable,
  PgQueryResultHKT,
  PgTransaction,
  IndexColumn,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { buildFilterConditions, type FilterConditions } from "./filtering";
import {
  buildSortConditions,
  getDefaultSort,
  type SortConditions,
} from "./sorting";
import { InternalServerError, NotFoundError } from "../utils/app-errors";
import { transactional } from "../db/transactional";
import { logger } from "./logger";
import db from "../db";

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

export interface BaseTable extends AnyPgTable {
  id: IndexColumn;
  createdAt: AnyPgColumn;
  updatedAt: AnyPgColumn;
}

export abstract class BaseRepository<S extends BaseModel, T extends BaseTable> {
  protected abstract table: T;

  async getAll(limit = 10, offset = 0, options?: QueryOptions) {
    const { filters = [], sorts = getDefaultSort(), where } = options || {};

    const filterConditions = buildFilterConditions(this.table, filters);
    const sortConditions = buildSortConditions(this.table, sorts);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    return (await db
      .select()
      .from(this.table as AnyPgTable)
      .limit(limit)
      .offset(offset)
      .where(combinedWhere)
      .orderBy(...sortConditions)) as S[];
  }

  async getById(id: number): Promise<S | null>;
  async getById<TColumns extends { [key in keyof S]?: true }>(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof S ? S[K] : never;
      }
    | null
  >;

  async getById<TColumns extends { [key in keyof S]?: true }>(
    id: number,
    columns?: TColumns,
  ) {
    if (columns) {
      const res =
        await // biome-ignore lint/suspicious/noExplicitAny: Couldn't find a way to type this
        (db.query[this.table._.name as keyof typeof db.query] as any).findFirst(
          {
            columns,
            where: (d: T) => eq(d.id, id),
          },
        );
      if (!res) {
        throw new NotFoundError(`Resource not found`);
      }
      return res;
    }

    const result = await db
      .select()
      .from(this.table as AnyPgTable)
      .where(eq(this.table.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }

  @transactional()
  async create(
    data: Omit<S, "id" | "createdAt" | "updatedAt">,
    tx?: PgTransaction<PgQueryResultHKT>,
  ): Promise<S> {
    if (!tx) {
      logger.error("Transaction is required");
      throw new InternalServerError("Something went wrong");
    }
    const result = (
      await tx
        .insert(this.table as AnyPgTable)
        .values(data)
        .returning()
    ).at(0);
    if (!result) {
      tx.rollback();
      throw new InternalServerError("Failed to create products");
    }

    return result as unknown as S;
  }

  @transactional()
  async update(
    id: number,
    data: Partial<S>,
    tx?: PgTransaction<PgQueryResultHKT>,
  ) {
    if (!tx) {
      logger.error("No transaction provided");
      throw new InternalServerError("Something went wrong");
    }
    const result = await tx
      .update(this.table)
      .set(data)
      .where(eq(this.table.id, id))
      .returning();
    if (!result) {
      throw new InternalServerError("Failed to update");
    }
    return result;
  }

  @transactional()
  async delete(
    id: number,
    tx?: PgTransaction<PgQueryResultHKT>,
  ): Promise<void> {
    if (!tx) {
      logger.error("No transaction provided");
      throw new InternalServerError("Something went wrong");
    }
    const result = await tx.delete(this.table).where(eq(this.table.id, id));
    if (!result) {
      throw new InternalServerError("Failed to delete");
    }
  }

  async count(options?: QueryOptions) {
    const { filters = [], where } = options || {};

    const filterConditions = buildFilterConditions(this.table, filters);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    const result = await db
      .select({ count: sql<string>`count(*)` })
      .from(this.table as AnyPgTable)
      .where(combinedWhere);
    const count = Number.parseInt(result[0]?.count);
    if (Number.isNaN(count)) {
      throw new InternalServerError("Failed to count products");
    }
    return count;
  }
}
