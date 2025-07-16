import { zValidator } from "@hono/zod-validator";
import { idParamSchema } from "@zod-schemas";
import { Hono } from "hono";
import { PaginatedResponse } from "../core/pagination";
import { orderItemsQuerySchema } from "../schemas/validation/order-items-query";
import { OrderItemsService } from "../service/order-items.service";
import { createValidationHook } from "../utils/validation";

const orderItemsRoute = new Hono();
const orderItemsService = new OrderItemsService();

// GET /orderItems - Get all orderItems with filtering and sorting
orderItemsRoute.get(
  "/",
  zValidator(
    "query",
    orderItemsQuerySchema,
    createValidationHook("Invalid query parameters"),
  ),
  async (c) => {
    const { page, pageSize, filters, sorts } = c.req.valid("query");

    const allOrderItems = await orderItemsService.getAllPaginated(
      { page, pageSize },
      { filters, sorts },
    );

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
    idParamSchema,
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
    idParamSchema,
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
    idParamSchema,
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
