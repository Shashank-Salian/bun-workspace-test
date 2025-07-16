import { zValidator } from "@hono/zod-validator";
import { idParamSchema } from "@zod-schemas";
import { Hono } from "hono";
import { PaginatedResponse } from "../core/pagination";
import { cartItemsQuerySchema } from "../schemas/validation/cart-items-query";
import { CartItemsService } from "../service/cart-items.service";
import { createValidationHook } from "../utils/validation";

const cartItemsRoute = new Hono();
const cartItemsService = new CartItemsService();

// GET /cartItems - Get all cartItems with filtering and sorting
cartItemsRoute.get(
  "/",
  zValidator(
    "query",
    cartItemsQuerySchema,
    createValidationHook("Invalid query parameters"),
  ),
  async (c) => {
    const { page, pageSize, filters, sorts } = c.req.valid("query");

    const allCartItems = await cartItemsService.getAllPaginated(
      { page, pageSize },
      { filters, sorts },
    );

    return c.json(
      new PaginatedResponse(
        true,
        "CartItems fetched successfully",
        200,
        allCartItems,
      ),
    );
  },
);

// GET /cartItems/:id - Get CartItem by ID
cartItemsRoute.get(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid cart items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const cartItem = await cartItemsService.getById(id);
    return c.json({
      message: "Successfully fetched cart items",
      data: cartItem,
    });
  },
);

// POST /cartItems - Create a new cart items
cartItemsRoute.post(
  "/",
  // TODO: Add zod validation - createCartItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   createCartItemSchema,
  //   createValidationHook("CartItems validation failed"),
  // ),
  async (c) => {
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const newCartItem = await cartItemsService.create(data);

    return c.json(
      {
        message: "Successfully created cart items",
        data: newCartItem,
      },
      201,
    );
  },
);

// PUT /cartItems/:id - Update cart items
cartItemsRoute.put(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid cart items ID"),
  ),
  // TODO: Add zod validation - updateCartItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   updateCartItemSchema,
  //   createValidationHook("CartItems validation failed"),
  // ),
  async (c) => {
    const { id } = c.req.valid("param");
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const updatedCartItem = await cartItemsService.update(id, data);

    return c.json({
      message: "Successfully updated cart items",
      data: updatedCartItem,
    });
  },
);

// DELETE /cartItems/:id - Delete cart items
cartItemsRoute.delete(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid cart items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedCartItem = await cartItemsService.delete(id);

    return c.json({
      message: "Successfully deleted cart items",
      data: deletedCartItem,
    });
  },
);

export default cartItemsRoute;
