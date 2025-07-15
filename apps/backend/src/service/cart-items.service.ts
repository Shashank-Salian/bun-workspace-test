import { eq } from "drizzle-orm";
import { cartItems } from "../schemas/cart-items";
import db from "../db";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../utils/app-errors";
import { tryCatch } from "../utils/utils";
import { isConstraintError } from "../utils/error-handler";

export class CartItemsService {
  async getAllCartItems() {
    const { data, error } = await tryCatch(db.select().from(cartItems));

    if (data) return data;
    throw new InternalServerError("Failed to fetch cart items", error);
  }

  async getCartItemsById(id: number) {
    const { data, error } = await tryCatch(
      db.select().from(cartItems).where(eq(cartItems.id, id)),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("cart items not found");
      }
      return data[0];
    }
    throw new InternalServerError("Failed to fetch cart items", error);
  }

  async createCartItems(cartItemsData: typeof cartItems.$inferInsert) {
    const { data, error } = await tryCatch(
      db.insert(cartItems).values(cartItemsData).returning(),
    );

    if (data) return data[0];

    throw new InternalServerError("Failed to create cart items", error);
  }

  async updateCartItems(
    id: number,
    cartItemsData: Partial<typeof cartItems.$inferInsert>,
  ) {
    const { data, error } = await tryCatch(
      db
        .update(cartItems)
        .set(cartItemsData)
        .where(eq(cartItems.id, id))
        .returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("cart items not found");
      }
      return data[0];
    }

    throw new InternalServerError("Failed to update cart items", error);
  }

  async deleteCartItems(id: number) {
    const { data, error } = await tryCatch(
      db.delete(cartItems).where(eq(cartItems.id, id)).returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("cart items not found");
      }
      return data[0];
    }

    throw new InternalServerError("Failed to delete cart items", error);
  }
}
