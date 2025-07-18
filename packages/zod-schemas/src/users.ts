import { z } from "zod";

export const usersSchema = z.object({
  id: z.number().positive().int(),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long!")
    .max(100, "Name must be less than 100 characters long!"),
  email: z.email({ message: "Enter valid email address!" }),
});

export const createUserSchema = usersSchema.omit({ id: true });

export const updateUserSchema = usersSchema.omit({ id: true }).partial({
  email: true,
  name: true,
});

export type UsersSchema = z.infer<typeof usersSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
