import { and, eq, sql } from "drizzle-orm";
import { BaseRepository, type QueryOptions } from "../core/base.repository";
import { buildFilterConditions } from "../core/filtering";
import { buildSortConditions, getDefaultSort } from "../core/sorting";
import db from "../db";
import { cartItems } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class CartItemsRepository extends BaseRepository<
  typeof cartItems.$inferSelect
> {
  /**
   * Get all cart items with filtering and sorting
   * @returns All cart items
   */
  async getAll(limit = 10, offset = 0, options?: QueryOptions) {
    const { filters = [], sorts = getDefaultSort(), where } = options || {};

    const filterConditions = buildFilterConditions(cartItems, filters);
    const sortConditions = buildSortConditions(cartItems, sorts);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    return await db
      .select()
      .from(cartItems)
      .limit(limit)
      .offset(offset)
      .where(combinedWhere)
      .orderBy(...sortConditions);
  }

  /**
   * Get count of all cart items with filtering
   * @param options - Query options including filters and where conditions
   * @returns Count of cart items
   */
  async count(options?: QueryOptions) {
    const { filters = [], where } = options || {};

    const filterConditions = buildFilterConditions(cartItems, filters);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(cartItems)
      .where(combinedWhere);
    return result[0]?.count ?? 0;
  }

  /**
   * Get a cart items by id
   * @param id - The id of the cart items to get
   * @returns The cart items
   */
  async getById(id: number): Promise<typeof cartItems.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof cartItems.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof cartItems.$inferSelect
          ? (typeof cartItems.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof cartItems.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.cartItems.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new cart items
   *
   * @throws {InternalServerError} - If the cart items creation fails
   * @throws {DrizzleQueryError} - If the cart items creation fails
   */
  async create(data: typeof cartItems.$inferInsert) {
    const result = (await db.insert(cartItems).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create cart items");
    }
    return result;
  }

  /**
   * Update a cart items
   * @param id - The id of the cart items to update
   * @param data - The data to update the cart items with
   * @throws {InternalServerError} - If the cart items update fails
   * @throws {DrizzleQueryError} - If the cart items update fails
   * @returns The updated cart items
   */
  async update(id: number, data: Partial<typeof cartItems.$inferSelect>) {
    const result = (
      await db
        .update(cartItems)
        .set(data)
        .where(eq(cartItems.id, id))
        .returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update cart items");
    }
    return result;
  }

  /**
   * Delete a cart items
   * @param id - The id of the cart items to delete
   * @throws {InternalServerError} - If the cart items deletion fails
   * @throws {DrizzleQueryError} - If the cart items deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(cartItems).where(eq(cartItems.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete cart items");
    }
  }
}
