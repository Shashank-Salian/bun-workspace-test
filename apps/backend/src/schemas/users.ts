import { integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { carts } from "./carts";
import { orders } from "./orders";

export const usersConstraints = {
  uq_users_email: "uq_users_email",
} as const;

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull(),
  },
  (table) => [unique(usersConstraints.uq_users_email).on(table.email)],
);

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
}));
