import { and, eq, sql } from "drizzle-orm";
import { BaseRepository, type QueryOptions } from "../core/base.repository";
import { buildFilterConditions } from "../core/filtering";
import { buildSortConditions, getDefaultSort } from "../core/sorting";
import db from "../db";
import { categories } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class CategoriesRepository extends BaseRepository<
  typeof categories.$inferSelect
> {
  /**
   * Get all categories with filtering and sorting
   * @returns All categories
   */
  async getAll(limit = 10, offset = 0, options?: QueryOptions) {
    const { filters = [], sorts = getDefaultSort(), where } = options || {};

    const filterConditions = buildFilterConditions(categories, filters);
    const sortConditions = buildSortConditions(categories, sorts);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    return await db
      .select()
      .from(categories)
      .limit(limit)
      .offset(offset)
      .where(combinedWhere)
      .orderBy(...sortConditions);
  }

  /**
   * Get count of all categories with filtering
   * @param options - Query options including filters and where conditions
   * @returns Count of categories
   */
  async count(options?: QueryOptions) {
    const { filters = [], where } = options || {};

    const filterConditions = buildFilterConditions(categories, filters);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(combinedWhere);
    return result[0]?.count ?? 0;
  }

  /**
   * Get a categories by id
   * @param id - The id of the categories to get
   * @returns The categories
   */
  async getById(id: number): Promise<typeof categories.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof categories.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof categories.$inferSelect
          ? (typeof categories.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof categories.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.categories.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new categories
   *
   * @throws {InternalServerError} - If the categories creation fails
   * @throws {DrizzleQueryError} - If the categories creation fails
   */
  async create(data: typeof categories.$inferInsert) {
    const result = (await db.insert(categories).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create categories");
    }
    return result;
  }

  /**
   * Update a categories
   * @param id - The id of the categories to update
   * @param data - The data to update the categories with
   * @throws {InternalServerError} - If the categories update fails
   * @throws {DrizzleQueryError} - If the categories update fails
   * @returns The updated categories
   */
  async update(id: number, data: Partial<typeof categories.$inferSelect>) {
    const result = (
      await db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update categories");
    }
    return result;
  }

  /**
   * Delete a categories
   * @param id - The id of the categories to delete
   * @throws {InternalServerError} - If the categories deletion fails
   * @throws {DrizzleQueryError} - If the categories deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(categories).where(eq(categories.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete categories");
    }
  }
}
