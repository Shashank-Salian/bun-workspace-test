import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { OrderItemsService } from "../service/order-items.service";
import { orderItems } from "../schemas/order-items";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";
import {
  createOrderItemsSchema,
  updateOrderItemsSchema,
} from "../schemas/order-items";

const orderItemsRoute = new Hono();
const orderItemsService = new OrderItemsService();

// GET /orderItems - Get all orderItems
orderItemsRoute.get("/", async (c) => {
  const allOrderItems = await orderItemsService.getAllOrderItems();
  return c.json({
    message: "Successfully fetched all orderItems",
    data: allOrderItems,
  });
});

// GET /orderItems/:id - Get orderItems by ID
orderItemsRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid order items ID") }),
    createValidationHook("Invalid order items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const orderItems = await orderItemsService.getOrderItemsById(id);
    return c.json({
      message: "Successfully fetched order items",
      data: orderItems,
    });
  },
);

// POST /orderItems - Create a new order items
orderItemsRoute.post(
  "/",
  zValidator(
    "json",
    createOrderItemsSchema,
    createValidationHook("OrderItems validation failed"),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const newOrderItems = await orderItemsService.createOrderItems(data);

    return c.json(
      {
        message: "Successfully created order items",
        data: newOrderItems,
      },
      201,
    );
  },
);

// PUT /orderItems/:id - Update order items
orderItemsRoute.put(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid order items ID") }),
    createValidationHook("Invalid order items ID"),
  ),
  zValidator(
    "json",
    updateOrderItemsSchema,
    createValidationHook("OrderItems validation failed"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const updatedOrderItems = await orderItemsService.updateOrderItems(
      id,
      data,
    );

    return c.json({
      message: "Successfully updated order items",
      data: updatedOrderItems,
    });
  },
);

// DELETE /orderItems/:id - Delete order items
orderItemsRoute.delete(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid order items ID") }),
    createValidationHook("Invalid order items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedOrderItems = await orderItemsService.deleteOrderItems(id);

    return c.json({
      message: "Successfully deleted order items",
      data: deletedOrderItems,
    });
  },
);

export default orderItemsRoute;
