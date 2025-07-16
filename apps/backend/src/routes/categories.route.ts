import { zValidator } from "@hono/zod-validator";
import {
  createCategorySchema,
  idParamSchema,
  updateCategorySchema,
} from "@zod-schemas";
import { Hono } from "hono";
import { PaginatedResponse, paginationParamsSchema } from "../core/pagination";
import { CategoriesService } from "../service/categories.service";
import { createValidationHook } from "../utils/validation";

const categoriesRoute = new Hono();
const categoriesService = new CategoriesService();

// GET /categories - Get all categories
categoriesRoute.get(
  "/",
  zValidator(
    "query",
    paginationParamsSchema,
    createValidationHook("Invalid pagination parameters"),
  ),
  async (c) => {
    const { page, pageSize } = c.req.valid("query");
    const allCategories = await categoriesService.getAllPaginated({
      page,
      pageSize,
    });

    return c.json(
      new PaginatedResponse(
        true,
        "Categories fetched successfully",
        200,
        allCategories,
      ),
    );
  },
);

// GET /categories/:id - Get Category by ID
categoriesRoute.get(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid categories ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const category = await categoriesService.getById(id);
    return c.json({
      message: "Successfully fetched categories",
      data: category,
    });
  },
);

// POST /categories - Create a new categories
categoriesRoute.post(
  "/",
  zValidator(
    "json",
    createCategorySchema,
    createValidationHook("Categories validation failed"),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const newCategory = await categoriesService.create(data);

    return c.json(
      {
        message: "Successfully created categories",
        data: newCategory,
      },
      201,
    );
  },
);

// PUT /categories/:id - Update categories
categoriesRoute.put(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid categories ID"),
  ),
  zValidator(
    "json",
    updateCategorySchema,
    createValidationHook("Categories validation failed"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const updatedCategory = await categoriesService.update(id, data);

    return c.json({
      message: "Successfully updated categories",
      data: updatedCategory,
    });
  },
);

// DELETE /categories/:id - Delete categories
categoriesRoute.delete(
  "/:id",
  zValidator(
    "param",
    idParamSchema,
    createValidationHook("Invalid categories ID"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedCategory = await categoriesService.delete(id);

    return c.json({
      message: "Successfully deleted categories",
      data: deletedCategory,
    });
  },
);

export default categoriesRoute;
