import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { products } from "./products";

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    increment: 1,
    minValue: 1,
  }),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 512 }).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
