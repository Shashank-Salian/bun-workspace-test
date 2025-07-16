import { pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { baseSchema } from "./base-schema";
import { carts } from "./carts";
import { orders } from "./orders";

export const users = pgTable(
  "users",
  {
    ...baseSchema,
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
  },
  (table) => [unique("uq_users_email").on(table.email)],
);

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
}));
