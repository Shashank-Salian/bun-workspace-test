import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { UsersService } from "../service/users.service";
import { users } from "../schemas/users";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";
import { createUserSchema, updateUserSchema } from "@zod-schemas";

const usersRoute = new Hono();
const usersService = new UsersService();

// GET /users - Get all users
usersRoute.get("/", async (c) => {
  const allUsers = await usersService.getAll();
  return c.json({
    message: "Successfully fetched all users",
    data: allUsers,
  });
});

// GET /users/:id - Get User by ID
usersRoute.get(
  "/:id",
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid users ID") }),
    createValidationHook("Invalid users ID"),
  ),
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
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid users ID") }),
    createValidationHook("Invalid users ID"),
  ),
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
  zValidator(
    "param",
    z.object({ id: z.coerce.number().int("Invalid users ID") }),
    createValidationHook("Invalid users ID"),
  ),
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
