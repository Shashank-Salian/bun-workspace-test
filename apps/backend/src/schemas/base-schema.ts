import { integer, timestamp } from "drizzle-orm/pg-core";

export const baseSchema = {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow(),
};
