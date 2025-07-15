import { eq, type SQL, sql } from "drizzle-orm";
import { BaseRepository } from "../core/base.repository";
import db from "../db";
import { products } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class ProductsRepository extends BaseRepository<
  typeof products.$inferSelect
> {
  /**
   * Get all products
   * @returns All products
   */
  async getAll(limit = 10, offset = 0, where?: SQL<unknown>) {
    return await db
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .where(where);
  }

  /**
   * Get count of all products
   * @param where - Optional where condition
   * @returns Count of products
   */
  async count(where?: SQL<unknown>) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(where);
    return result[0]?.count ?? 0;
  }

  /**
   * Get a products by id
   * @param id - The id of the products to get
   * @returns The products
   */
  async getById(id: number): Promise<typeof products.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof products.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof products.$inferSelect
          ? (typeof products.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof products.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.products.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new products
   *
   * @throws {InternalServerError} - If the products creation fails
   * @throws {DrizzleQueryError} - If the products creation fails
   */
  async create(data: typeof products.$inferInsert) {
    const result = (await db.insert(products).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create products");
    }
    return result;
  }

  /**
   * Update a products
   * @param id - The id of the products to update
   * @param data - The data to update the products with
   * @throws {InternalServerError} - If the products update fails
   * @throws {DrizzleQueryError} - If the products update fails
   * @returns The updated products
   */
  async update(id: number, data: Partial<typeof products.$inferSelect>) {
    const result = (
      await db.update(products).set(data).where(eq(products.id, id)).returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update products");
    }
    return result;
  }

  /**
   * Delete a products
   * @param id - The id of the products to delete
   * @throws {InternalServerError} - If the products deletion fails
   * @throws {DrizzleQueryError} - If the products deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(products).where(eq(products.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete products");
    }
  }
}
