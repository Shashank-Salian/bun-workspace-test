import {
  foreignKey,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { orderItems } from "./order-items";
import { users } from "./users";

export const orders = pgTable(
  "orders",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "orders_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    status: varchar({ length: 20 }).default("pending").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user",
    }),
  ],
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));
