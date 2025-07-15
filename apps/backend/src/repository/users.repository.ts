import { eq, type SQL, sql } from "drizzle-orm";
import { BaseRepository } from "../core/base.repository";
import db from "../db";
import { users } from "../schemas";
import { InternalServerError } from "../utils/app-errors";

export class UsersRepository extends BaseRepository<typeof users.$inferSelect> {
  /**
   * Get all users
   * @returns All users
   */
  async getAll(limit = 10, offset = 0, where?: SQL<unknown>) {
    return await db
      .select()
      .from(users)
      .limit(limit)
      .offset(offset)
      .where(where);
  }

  /**
   * Get count of all users
   * @param where - Optional where condition
   * @returns Count of users
   */
  async count(where?: SQL<unknown>) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(where);
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
