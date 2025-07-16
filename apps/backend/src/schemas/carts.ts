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
import { baseSchema } from "./base-schema";

export const carts = pgTable(
  "carts",
  {
    ...baseSchema,
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
