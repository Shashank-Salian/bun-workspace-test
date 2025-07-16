import { zValidator } from "@hono/zod-validator";
import {
  createUserSchema,
  idParamSchema,
  updateUserSchema,
} from "@zod-schemas";
import { Hono } from "hono";
import { PaginatedResponse } from "../core/pagination";
import { usersQuerySchema } from "../schemas/validation/users-query";
import { UsersService } from "../service/users.service";
import { createValidationHook } from "../utils/validation";

const usersRoute = new Hono();
const usersService = new UsersService();

// GET /users - Get all users with filtering and sorting
usersRoute.get(
  "/",
  zValidator(
    "query",
    usersQuerySchema,
    createValidationHook("Invalid query parameters"),
  ),
  async (c) => {
    const { page, pageSize, filters, sorts } = c.req.valid("query");

    const allUsers = await usersService.getAllPaginated(
      { page, pageSize },
      { filters, sorts },
    );

    return c.json(
      new PaginatedResponse(true, "Users fetched successfully", 200, allUsers),
    );
  },
);

// GET /users/:id - Get User by ID
usersRoute.get(
  "/:id",
  zValidator("param", idParamSchema, createValidationHook("Invalid users ID")),
  async (c) => {
    const { id } = c.req.valid("param");
    const user = await usersService.getById(id);
    return c.json({
      message: "Successfully fetched users",
      data: user,
    });
  },
);

// POST /users - Create a new users
usersRoute.post(
  "/",
  zValidator(
    "json",
    createUserSchema,
    createValidationHook("Users validation failed"),
  ),
  async (c) => {
    const data = c.req.valid("json");
    const newUser = await usersService.create(data);

    return c.json(
      {
        message: "Successfully created users",
        data: newUser,
      },
      201,
    );
  },
);

// PUT /users/:id - Update users
usersRoute.put(
  "/:id",
  zValidator("param", idParamSchema, createValidationHook("Invalid users ID")),
  zValidator(
    "json",
    updateUserSchema,
    createValidationHook("Users validation failed"),
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const updatedUser = await usersService.update(id, data);

    return c.json({
      message: "Successfully updated users",
      data: updatedUser,
    });
  },
);

// DELETE /users/:id - Delete users
usersRoute.delete(
  "/:id",
  zValidator("param", idParamSchema, createValidationHook("Invalid users ID")),
  async (c) => {
    const { id } = c.req.valid("param");
    const deletedUser = await usersService.delete(id);

    return c.json({
      message: "Successfully deleted users",
      data: deletedUser,
    });
  },
);

export default usersRoute;
