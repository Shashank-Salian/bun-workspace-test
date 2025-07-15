import { toCamelCase, toPascalCase, type SchemaInfo } from "./generator-utils";

export class RepositoryGenerator {
  generateRepositoryTemplate(schemaInfo: SchemaInfo): string {
    const { entityName, fileName, kebabCaseFileName } = schemaInfo;
    const repositoryName = `${entityName}Repository`;
    const humanizedEntityName = kebabCaseFileName
      .split("-")
      .join(" ")
      .toLowerCase();

    return `import { eq } from "drizzle-orm";
import db from "../db";
import { ${fileName} } from "../schemas";
import { BaseRepository } from "../core/base.repository";
import { InternalServerError } from "../utils/app-errors";

export class ${repositoryName} extends BaseRepository<typeof ${fileName}.$inferSelect> {
  /**
   * Get all ${humanizedEntityName}
   * @returns All ${humanizedEntityName}
   */
  async getAll(limit = 10, offset = 0) {
    return db.select().from(${fileName}).limit(limit).offset(offset);
  }

  /**
   * Get a ${humanizedEntityName} by id
   * @param id - The id of the ${humanizedEntityName} to get
   * @returns The ${humanizedEntityName}
   */
  async getById(id: number): Promise<typeof ${fileName}.$inferSelect | null>;
  async getById<
    TColumns extends { [key in keyof typeof ${fileName}.$inferSelect]?: true },
  >(
    id: number,
    columns: TColumns,
  ): Promise<
    | {
        [K in keyof TColumns]: K extends keyof typeof ${fileName}.$inferSelect
          ? (typeof ${fileName}.$inferSelect)[K]
          : never;
      }
    | null
  >;

  async getById<
    TColumns extends { [key in keyof typeof ${fileName}.$inferSelect]?: true },
  >(id: number, columns?: TColumns) {
    if (columns) {
      return await db.query.${fileName}.findFirst({
        columns,
        where: (d) => eq(d.id, id),
      });
    }

    const result = await db
      .select()
      .from(${fileName})
      .where(eq(${fileName}.id, id))
      .limit(1);
    return result.at(0) ?? null;
  }
  /**
   * Create a new ${humanizedEntityName}
   *
   * @throws {InternalServerError} - If the ${humanizedEntityName} creation fails
   * @throws {DrizzleQueryError} - If the ${humanizedEntityName} creation fails
   */
  async create(data: typeof ${fileName}.$inferInsert) {
    const result = (await db.insert(${fileName}).values(data).returning()).at(0);
    if (!result) {
      throw new InternalServerError("Failed to create ${humanizedEntityName}");
    }
    return result;
  }

  /**
   * Update a ${humanizedEntityName}
   * @param id - The id of the ${humanizedEntityName} to update
   * @param data - The data to update the ${humanizedEntityName} with
   * @throws {InternalServerError} - If the ${humanizedEntityName} update fails
   * @throws {DrizzleQueryError} - If the ${humanizedEntityName} update fails
   * @returns The updated ${humanizedEntityName}
   */
  async update(id: number, data: Partial<typeof ${fileName}.$inferSelect>) {
    const result = (
      await db.update(${fileName}).set(data).where(eq(${fileName}.id, id)).returning()
    ).at(0);

    if (!result) {
      throw new InternalServerError("Failed to update ${humanizedEntityName}");
    }
    return result;
  }

  /**
   * Delete a ${humanizedEntityName}
   * @param id - The id of the ${humanizedEntityName} to delete
   * @throws {InternalServerError} - If the ${humanizedEntityName} deletion fails
   * @throws {DrizzleQueryError} - If the ${humanizedEntityName} deletion fails
   */
  async delete(id: number) {
    const result = (
      await db.delete(${fileName}).where(eq(${fileName}.id, id)).returning()
    ).at(0);
    if (!result) {
      throw new InternalServerError("Failed to delete ${humanizedEntityName}");
    }
  }
}`;
  }
}
