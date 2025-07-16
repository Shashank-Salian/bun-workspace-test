import { zValidator } from "@hono/zod-validator";
import {
  createProductSchema,
  idParamSchema,
  updateProductSchema,
} from "@zod-schemas";
import { Hono } from "hono";
import { PaginatedResponse, paginationParamsSchema } from "../core/pagination";
import { ProductsService } from "../service/products.service";
import { createValidationHook } from "../utils/validation";

const productsRoute = new Hono();
const productsService = new ProductsService();

// GET /products - Get all products
productsRoute.get(
  "/",
  zValidator(
    "query",
    paginationParamsSchema,
    createValidationHook("Invalid pagination parameters"),
  ),
  async (c) => {
    const { page, pageSize } = c.req.valid("query");
    const allProducts = await productsService.getAllPaginated({
      page,
      pageSize,
    });

    return c.json(
      new PaginatedResponse(
        true,
        "Products fetched successfully",
        200,
        allProducts,
      ),
    );
  },
);

// GET /products/:id - Get Product by ID
productsRoute.get(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid products ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const product = await productsService.getById(id);
    return c.json({
      message: "Successfully fetched products",
      data: product,
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
    const newProduct = await productsService.create(data);

    return c.json(
      {
        message: "Successfully created products",
        data: newProduct,
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
    idParamSchema,
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
    const updatedProduct = await productsService.update(id, data);

    return c.json({
      message: "Successfully updated products",
      data: updatedProduct,
    });
  },
);

// DELETE /products/:id - Delete products
productsRoute.delete(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid products ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedProduct = await productsService.delete(id);

    return c.json({
      message: "Successfully deleted products",
      data: deletedProduct,
    });
  },
);

export default productsRoute;
