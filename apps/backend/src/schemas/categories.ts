import { pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseSchema } from "./base-schema";
import { products } from "./products";

export const categories = pgTable("categories", {
  ...baseSchema,
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 512 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
