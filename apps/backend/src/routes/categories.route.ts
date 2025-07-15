import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { CategoriesService } from "../service/categories.service";
import { categories } from "../schemas/categories";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";
import { createCategorySchema, updateCategorySchema } from "@zod-schemas";

const categoriesRoute = new Hono();
const categoriesService = new CategoriesService();

// GET /categories - Get all categories
categoriesRoute.get("/", async (c) => {
  const allCategories = await categoriesService.getAll();
  return c.json({
    message: "Successfully fetched all categories",
    data: allCategories,
  });
});

// GET /categories/:id - Get Category by ID
categoriesRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid categories ID") }),
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
    z.object({ id: z.coerce.number().int("Invalid categories ID") }),
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
    z.object({ id: z.coerce.number().int("Invalid categories ID") }),
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
