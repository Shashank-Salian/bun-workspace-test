import {
  pgTable,
  integer,
  varchar,
  text,
  foreignKey,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { z } from "zod/v4";

export const products = pgTable(
  "products",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    price: integer().notNull(),
    description: text(),
    categoryId: integer("category_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: "fk_products_category",
    }).onDelete("cascade"),
  ],
);

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
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)), // allow empty string as optional
  categoryId: z
    .number()
    .int({ message: "Category ID must be an integer" })
    .nonnegative({ message: "Category ID must be a positive number" }),
});

export const createProductSchema = productsSchema.omit({
  id: true,
});

export const updateProductSchema = productsSchema.partial({
  categoryId: true,
  description: true,
  price: true,
  name: true,
});

export type Product = z.infer<typeof productsSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
