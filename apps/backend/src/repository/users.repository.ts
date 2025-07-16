import { and, eq, sql } from "drizzle-orm";
import { BaseRepository, type QueryOptions } from "../core/base.repository";
import { buildFilterConditions } from "../core/filtering";
import { buildSortConditions, getDefaultSort } from "../core/sorting";
import db from "../db";
import { users } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class UsersRepository extends BaseRepository<typeof users.$inferSelect> {
  /**
   * Get all users with filtering and sorting
   * @returns All users
   */
  async getAll(limit = 10, offset = 0, options?: QueryOptions) {
    const { filters = [], sorts = getDefaultSort(), where } = options || {};

    const filterConditions = buildFilterConditions(users, filters);
    const sortConditions = buildSortConditions(users, sorts);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    return await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .where(combinedWhere)
      .orderBy(...sortConditions);
  }

  /**
   * Get count of all users with filtering
   * @param options - Query options including filters and where conditions
   * @returns Count of users
   */
  async count(options?: QueryOptions) {
    const { filters = [], where } = options || {};

    const filterConditions = buildFilterConditions(users, filters);

    const combinedWhere =
      filterConditions && where
        ? and(filterConditions, where)
        : filterConditions || where;

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(combinedWhere);
    return result[0]?.count ?? 0;
  }

  /**
   * Get a users by id
   * @param id - The id of the users to get
   * @returns The users
   */
  async getById(id: number): Promise<typeof users.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof users.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof users.$inferSelect
          ? (typeof users.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof users.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.users.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new users
   *
   * @throws {InternalServerError} - If the users creation fails
   * @throws {DrizzleQueryError} - If the users creation fails
   */
  async create(data: typeof users.$inferInsert) {
    const result = (await db.insert(users).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create users");
    }
    return result;
  }

  /**
   * Update a users
   * @param id - The id of the users to update
   * @param data - The data to update the users with
   * @throws {InternalServerError} - If the users update fails
   * @throws {DrizzleQueryError} - If the users update fails
   * @returns The updated users
   */
  async update(id: number, data: Partial<typeof users.$inferSelect>) {
    const result = (
      await db.update(users).set(data).where(eq(users.id, id)).returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update users");
    }
    return result;
  }

  /**
   * Delete a users
   * @param id - The id of the users to delete
   * @throws {InternalServerError} - If the users deletion fails
   * @throws {DrizzleQueryError} - If the users deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(users).where(eq(users.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete users");
    }
  }
}
