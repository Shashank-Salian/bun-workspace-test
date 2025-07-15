import { eq } from "drizzle-orm";
import { products } from "../schemas/products";
import db from "../db";
import {
  InternalServerError,
  NotFoundError,
  AppError,
  AppErrorCodes,
} from "../utils/app-errors";
import { tryCatch } from "../utils/utils";
import { getPgErrorMessageByCode } from "../utils/error-handler";
import { DrizzleQueryError } from "drizzle-orm/errors";

export class ProductsService {
  async getAllProducts() {
    const { data, error } = await tryCatch(db.select().from(products));

    if (data) return data;
    throw new InternalServerError("Failed to fetch products", error);
  }

  async getProductsById(id: number) {
    const { data, error } = await tryCatch(
      db.select().from(products).where(eq(products.id, id)),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("products not found");
      }
      return data[0];
    }
    throw new InternalServerError("Failed to fetch products", error);
  }

  async createProducts(productsData: typeof products.$inferInsert) {
    const { data, error } = await tryCatch(
      db.insert(products).values(productsData).returning(),
    );

    if (data) return data[0];

    // Handle database errors
    if (error instanceof DrizzleQueryError) {
      const message = getPgErrorMessageByCode(error);
      throw new AppError(message, 400, AppErrorCodes.BAD_REQUEST, error);
    }
    throw new InternalServerError("Failed to create products", error);
  }

  async updateProducts(
    id: number,
    productsData: Partial<typeof products.$inferInsert>,
  ) {
    const { data, error } = await tryCatch(
      db
        .update(products)
        .set(productsData)
        .where(eq(products.id, id))
        .returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("products not found");
      }
      return data[0];
    }

    // Handle database errors
    if (error instanceof DrizzleQueryError) {
      const message = getPgErrorMessageByCode(error);
      throw new AppError(message, 400, AppErrorCodes.BAD_REQUEST, error);
    }
    throw new InternalServerError("Failed to update products", error);
  }

  async deleteProducts(id: number) {
    const { data, error } = await tryCatch(
      db.delete(products).where(eq(products.id, id)).returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("products not found");
      }
      return data[0];
    }

    throw new InternalServerError("Failed to delete products", error);
  }
}
