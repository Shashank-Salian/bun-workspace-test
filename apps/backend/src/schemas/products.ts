import {
  foreignKey,
  integer,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseSchema } from "./base-schema";
import { cartItems } from "./cart-items";
import { categories } from "./categories";
import { orderItems } from "./order-items";

export const products = pgTable(
  "products",
  {
    ...baseSchema,
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

export const productsRelations = relations(products, ({ many, one }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  category: one(categories),
}));

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
