import { z } from "zod/v4";

export const productsSchema = z.object({
  id: z.number().min(1, { message: "ID is required" }),
  name: z
    .string()
    .min(1, { message: "Product name cannot be empty" })
    .max(100, { message: "Product name cannot exceed 100 characters" })
    .meta({}),
  price: z
    .number()
    .int({ message: "Price must be an integer" })
    .nonnegative({ message: "Price cannot be negative" }),
  description: z.string().or(z.literal("").transform(() => null)), // allow empty string as optional
  categoryId: z
    .number()
    .int({ message: "Category ID must be an integer" })
    .nonnegative({ message: "Category ID must be a positive number" }),
});

export const createProductSchema = productsSchema.omit({
  id: true,
});

export const updateProductSchema = productsSchema.omit({ id: true }).partial({
  categoryId: true,
  description: true,
  price: true,
  name: true,
});

export type Product = z.infer<typeof productsSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
