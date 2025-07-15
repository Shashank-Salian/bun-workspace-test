import { pgTable, unique, integer, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

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
