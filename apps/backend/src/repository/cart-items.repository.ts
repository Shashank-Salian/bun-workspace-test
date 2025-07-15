import { eq, type SQL, sql } from "drizzle-orm";
import { BaseRepository } from "../core/base.repository";
import db from "../db";
import { cartItems } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class CartItemsRepository extends BaseRepository<
  typeof cartItems.$inferSelect
> {
  /**
   * Get all cart items
   * @returns All cart items
   */
  async getAll(limit = 10, offset = 0, where?: SQL<unknown>) {
    return await db
      .select()
      .from(cartItems)
      .limit(limit)
      .offset(offset)
      .where(where);
  }

  /**
   * Get count of all cart items
   * @param where - Optional where condition
   * @returns Count of cart items
   */
  async count(where?: SQL<unknown>) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(cartItems)
      .where(where);
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
