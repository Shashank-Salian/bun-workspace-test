import {
  type AllowedSortFields,
  createQuerySchema,
  type FieldOperatorMap,
} from "./query-validation.helpers";

// Define allowed fields for users with their allowed operators
const ALLOWED_USER_FILTER_FIELDS = {
  id: ["eq", "ne", "in", "not_in"],
  name: ["eq", "ne", "like", "in", "not_in"],
  email: ["eq", "ne", "like", "in", "not_in"],
  createdAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
  updatedAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
} as const satisfies FieldOperatorMap;

const ALLOWED_USER_SORT_FIELDS = [
  "id",
  "name",
  "email",
  "createdAt",
  "updatedAt",
] as const satisfies AllowedSortFields;

// Create union types from the objects/arrays
export type AllowedUserFilterField = keyof typeof ALLOWED_USER_FILTER_FIELDS;
export type AllowedUserSortField = (typeof ALLOWED_USER_SORT_FIELDS)[number];

// Create the query schema using the factory function
export const usersQuerySchema = createQuerySchema(
  ALLOWED_USER_FILTER_FIELDS,
  ALLOWED_USER_SORT_FIELDS,
);

// Export types and constants for reference
export { ALLOWED_USER_FILTER_FIELDS, ALLOWED_USER_SORT_FIELDS };
