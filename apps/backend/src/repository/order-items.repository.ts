import { and, eq, sql } from "drizzle-orm";
import { BaseRepository, type QueryOptions } from "../core/base.repository";
import { buildFilterConditions } from "../core/filtering";
import { buildSortConditions, getDefaultSort } from "../core/sorting";
import db from "../db";
import { orderItems } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class OrderItemsRepository extends BaseRepository<
  typeof orderItems.$inferSelect
> {
  /**
   * Get all order items with filtering and sorting
   * @returns All order items
   */
  async getAll(limit = 10, offset = 0, options?: QueryOptions) {
    const { filters = [], sorts = getDefaultSort(), where } = options || {};

    const filterConditions = buildFilterConditions(orderItems, filters);
    const sortConditions = buildSortConditions(orderItems, sorts);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    return await db
      .select()
      .from(orderItems)
      .limit(limit)
      .offset(offset)
      .where(combinedWhere)
      .orderBy(...sortConditions);
  }

  /**
   * Get count of all order items with filtering
   * @param options - Query options including filters and where conditions
   * @returns Count of order items
   */
  async count(options?: QueryOptions) {
    const { filters = [], where } = options || {};

    const filterConditions = buildFilterConditions(orderItems, filters);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(orderItems)
      .where(combinedWhere);
    return result[0]?.count ?? 0;
  }

  /**
   * Get a order items by id
   * @param id - The id of the order items to get
   * @returns The order items
   */
  async getById(id: number): Promise<typeof orderItems.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof orderItems.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof orderItems.$inferSelect
          ? (typeof orderItems.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof orderItems.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.orderItems.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new order items
   *
   * @throws {InternalServerError} - If the order items creation fails
   * @throws {DrizzleQueryError} - If the order items creation fails
   */
  async create(data: typeof orderItems.$inferInsert) {
    const result = (await db.insert(orderItems).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create order items");
    }
    return result;
  }

  /**
   * Update a order items
   * @param id - The id of the order items to update
   * @param data - The data to update the order items with
   * @throws {InternalServerError} - If the order items update fails
   * @throws {DrizzleQueryError} - If the order items update fails
   * @returns The updated order items
   */
  async update(id: number, data: Partial<typeof orderItems.$inferSelect>) {
    const result = (
      await db
        .update(orderItems)
        .set(data)
        .where(eq(orderItems.id, id))
        .returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update order items");
    }
    return result;
  }

  /**
   * Delete a order items
   * @param id - The id of the order items to delete
   * @throws {InternalServerError} - If the order items deletion fails
   * @throws {DrizzleQueryError} - If the order items deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(orderItems).where(eq(orderItems.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete order items");
    }
  }
}
