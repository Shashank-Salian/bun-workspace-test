import { eq } from "drizzle-orm";
import { orderItems } from "../schemas/order-items";
import db from "../db";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  BadRequestError,
} from "../utils/app-errors";
import { tryCatch } from "../utils/utils";
import { isConstraintError } from "../utils/error-handler";

export class OrderItemsService {
  async getAllOrderItems() {
    const { data, error } = await tryCatch(db.select().from(orderItems));

    if (data) return data;
    throw new InternalServerError("Failed to fetch order items", error);
  }

  async getOrderItemsById(id: number) {
    const { data, error } = await tryCatch(
      db.select().from(orderItems).where(eq(orderItems.id, id)),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("order items not found");
      }
      return data[0];
    }
    throw new InternalServerError("Failed to fetch order items", error);
  }

  async createOrderItems(orderItemsData: typeof orderItems.$inferInsert) {
    const { data, error } = await tryCatch(
      db.insert(orderItems).values(orderItemsData).returning(),
    );

    if (data) return data[0];

    throw new InternalServerError("Failed to create order items", error);
  }

  async updateOrderItems(
    id: number,
    orderItemsData: Partial<typeof orderItems.$inferInsert>,
  ) {
    const { data, error } = await tryCatch(
      db
        .update(orderItems)
        .set(orderItemsData)
        .where(eq(orderItems.id, id))
        .returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("order items not found");
      }
      return data[0];
    }

    throw new InternalServerError("Failed to update order items", error);
  }

  async deleteOrderItems(id: number) {
    const { data, error } = await tryCatch(
      db.delete(orderItems).where(eq(orderItems.id, id)).returning(),
    );

    if (data) {
      if (data.length === 0) {
        throw new NotFoundError("order items not found");
      }
      return data[0];
    }

    throw new InternalServerError("Failed to delete order items", error);
  }
}
