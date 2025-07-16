import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { cartItems } from "./cart-items";
import { users } from "./users";

export const carts = pgTable(
  "carts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity({
      name: "carts_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    codAvailable: boolean("cod_available").default(false).notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user",
    }),
    unique("carts_user_id_key").on(table.userId),
  ],
);

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));
