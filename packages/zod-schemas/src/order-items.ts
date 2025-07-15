import { z } from "zod/v4";

export const orderItemsSchema = z.object({
  id: z
    .number()
    .int({ message: "ID must be an integer" })
    .nonnegative({ message: "ID must be a positive number" }),

  orderId: z
    .number({
      error: "Order ID is required",
    })
    .int({ message: "Order ID must be an integer" })
    .nonnegative({ message: "Order ID must be a positive number" }),

  productId: z
    .number({
      error: "Product ID is required",
    })
    .int({ message: "Product ID must be an integer" })
    .nonnegative({ message: "Product ID must be a positive number" }),

  quantity: z
    .number({
      error: "Quantity must be a number",
    })
    .int({ message: "Quantity must be an integer" })
    .min(1, { message: "Quantity must be at least 1" }),
});

export const createOrderItemsSchema = orderItemsSchema.omit({ id: true });
export const updateOrderItemsSchema = orderItemsSchema.partial({
  orderId: true,
  productId: true,
  quantity: true,
});

export type OrderItem = z.infer<typeof orderItemsSchema>;
export type CreateOrderItem = z.infer<typeof createOrderItemsSchema>;
export type UpdateOrderItem = z.infer<typeof updateOrderItemsSchema>;
