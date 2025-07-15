import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { CartItemsService } from "../service/cart-items.service";
import { cartItems } from "../schemas/cart-items";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";

const cartItemsRoute = new Hono();
const cartItemsService = new CartItemsService();

// GET /cartItems - Get all cartItems
cartItemsRoute.get("/", async (c) => {
  const allCartItems = await cartItemsService.getAllCartItems();
  return c.json({
    message: "Successfully fetched all cartItems",
    data: allCartItems,
  });
});

// GET /cartItems/:id - Get cartItems by ID
cartItemsRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid cart items ID") }),
    createValidationHook("Invalid cart items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const cartItems = await cartItemsService.getCartItemsById(id);
    return c.json({
      message: "Successfully fetched cart items",
      data: cartItems,
    });
  },
);

// POST /cartItems - Create a new cart items
cartItemsRoute.post(
  "/",
  // TODO: Add zod validation - createCartItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   createCartItemsSchema,
  //   createValidationHook("CartItems validation failed"),
  // ),
  async (c) => {
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const newCartItems = await cartItemsService.createCartItems(data);

    return c.json(
      {
        message: "Successfully created cart items",
        data: newCartItems,
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
    z.object({ id: z.coerce.number().int("Invalid cart items ID") }),
    createValidationHook("Invalid cart items ID"),
  ),
  // TODO: Add zod validation - updateCartItemsSchema not found in schema file
  // zValidator(
  //   "json",
  //   updateCartItemsSchema,
  //   createValidationHook("CartItems validation failed"),
  // ),
  async (c) => {
    const { id } = c.req.valid("param");
    // TODO: Replace with c.req.valid("json") when zValidator is enabled
    const data = await c.req.json();
    const updatedCartItems = await cartItemsService.updateCartItems(id, data);

    return c.json({
      message: "Successfully updated cart items",
      data: updatedCartItems,
    });
  },
);

// DELETE /cartItems/:id - Delete cart items
cartItemsRoute.delete(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid cart items ID") }),
    createValidationHook("Invalid cart items ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedCartItems = await cartItemsService.deleteCartItems(id);

    return c.json({
      message: "Successfully deleted cart items",
      data: deletedCartItems,
    });
  },
);

export default cartItemsRoute;
