import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ProductsService } from "../service/products.service";
import { products } from "../schemas/products";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";
import { createProductSchema, updateProductSchema } from "../schemas/products";

const productsRoute = new Hono();
const productsService = new ProductsService();

// GET /products - Get all products
productsRoute.get("/", async (c) => {
  const allProducts = await productsService.getAllProducts();
  return c.json({
    message: "Successfully fetched all products",
    data: allProducts,
  });
});

// GET /products/:id - Get products by ID
productsRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid products ID") }),
    createValidationHook("Invalid products ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const products = await productsService.getProductsById(id);
    return c.json({
      message: "Successfully fetched products",
      data: products,
    });
  },
);

// POST /products - Create a new products
productsRoute.post(
  "/",
  zValidator(
    "json",
    createProductSchema,
    createValidationHook("Products validation failed"),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const newProducts = await productsService.createProducts(data);

    return c.json(
      {
        message: "Successfully created products",
        data: newProducts,
      },
      201,
    );
  },
);

// PUT /products/:id - Update products
productsRoute.put(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid products ID") }),
    createValidationHook("Invalid products ID"),
  ),
  zValidator(
    "json",
    updateProductSchema,
    createValidationHook("Products validation failed"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const updatedProducts = await productsService.updateProducts(id, data);

    return c.json({
      message: "Successfully updated products",
      data: updatedProducts,
    });
  },
);

// DELETE /products/:id - Delete products
productsRoute.delete(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid products ID") }),
    createValidationHook("Invalid products ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedProducts = await productsService.deleteProducts(id);

    return c.json({
      message: "Successfully deleted products",
      data: deletedProducts,
    });
  },
);

export default productsRoute;
