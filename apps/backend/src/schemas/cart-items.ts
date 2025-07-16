import { foreignKey, integer, pgTable, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { carts } from "./carts";
import { products } from "./products";

export const cartItems = pgTable(
  "cart_items",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "cart_items_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    cartId: integer("cart_id")
      .notNull()
      .references(() => carts.id, {
        onDelete: "cascade",
      }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "cascade",
      }),
    quantity: integer().default(1).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.cartId],
      foreignColumns: [carts.id],
      name: "cart",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product",
    }),
    unique("cart_items_product_id_key").on(table.productId),
  ],
);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));
