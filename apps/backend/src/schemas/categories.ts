import { pgTable, varchar } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({
    increment: 1,
    minValue: 1,
  }),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 512 }).notNull(),
});
