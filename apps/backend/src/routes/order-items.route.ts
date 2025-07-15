import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod/v4";
import { PaginatedResponse, paginationParamsSchema } from "../core/pagination";
import { OrderItemsService } from "../service/order-items.service";
import { createValidationHook } from "../utils/validation";

const orderItemsRoute = new Hono();
const orderItemsService = new OrderItemsService();

// GET /orderItems - Get all orderItems
orderItemsRoute.get(
  "/",
  zValidator(
    "query",
    paginationParamsSchema,
    createValidationHook("Invalid pagination parameters"),
  ),
  async (c) => {
    const { page, pageSize } = c.req.valid("query");
    const allOrderItems = await orderItemsService.getAllPaginated({
      page,
      pageSize,
    });

    return c.json(
      new PaginatedResponse(
        true,
        "OrderItems fetched successfully",
        200,
        allOrderItems,
      ),
    );
  },
);

// GET /orderItems/:id - Get OrderItem by ID
orderItemsRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid order items ID") }),
    createValidationHook("Invalid order items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const orderItem = await orderItemsService.getById(id);
    return c.json({
      message: "Successfully fetched order items",
      data: orderItem,
    });
  },
);

// POST /orderItems - Create a new order items
orderItemsRoute.post(
  "/",
  // TODO: Add zod validation - createOrderItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   createOrderItemSchema,
  //   createValidationHook("OrderItems validation failed"),
  // ),
  async (c) => {
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const newOrderItem = await orderItemsService.create(data);

    return c.json(
      {
        message: "Successfully created order items",
        data: newOrderItem,
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
  // TODO: Add zod validation - updateOrderItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   updateOrderItemSchema,
  //   createValidationHook("OrderItems validation failed"),
  // ),
  async (c) => {
    const { id } = c.req.valid("param");
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const updatedOrderItem = await orderItemsService.update(id, data);

    return c.json({
      message: "Successfully updated order items",
      data: updatedOrderItem,
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
    const deletedOrderItem = await orderItemsService.delete(id);

    return c.json({
      message: "Successfully deleted order items",
      data: deletedOrderItem,
    });
  },
);

export default orderItemsRoute;
