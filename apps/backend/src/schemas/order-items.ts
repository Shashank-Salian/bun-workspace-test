import { foreignKey, integer, pgTable } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseSchema } from "./base-schema";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable(
  "order_items",
  {
    ...baseSchema,
    orderId: integer("order_id")
      .notNull()
      .references(() => orders.id, {
        onDelete: "cascade",
      }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, {
        onDelete: "restrict",
      }),
    quantity: integer().default(1).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [orders.id],
      name: "order",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.id],
      name: "product",
    }),
  ],
);

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
