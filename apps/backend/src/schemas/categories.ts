import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { products } from "./products";
import { baseSchema } from "./base-schema";

export const categories = pgTable("categories", {
  ...baseSchema,
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 512 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
