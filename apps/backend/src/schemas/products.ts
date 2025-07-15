import {
  foreignKey,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

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
