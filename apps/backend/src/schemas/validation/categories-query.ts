import {
  type AllowedSortFields,
  createQuerySchema,
  type FieldOperatorMap,
  getAllowedOperatorsForField,
} from "./query-validation.helpers";

// Define allowed fields for categories with their allowed operators
const ALLOWED_CATEGORY_FILTER_FIELDS = {
  id: ["eq", "ne", "in", "not_in"],
  name: ["eq", "ne", "like", "in", "not_in"],
  description: ["eq", "ne", "like"],
  createdAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
  updatedAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
} as const satisfies FieldOperatorMap;

const ALLOWED_CATEGORY_SORT_FIELDS = [
  "id",
  "name",
  "description",
  "createdAt",
  "updatedAt",
] as const satisfies AllowedSortFields;

// Create union types from the objects/arrays
export type AllowedCategoryFilterField =
  keyof typeof ALLOWED_CATEGORY_FILTER_FIELDS;
export type AllowedCategorySortField =
  (typeof ALLOWED_CATEGORY_SORT_FIELDS)[number];

// Create the query schema using the factory function
export const categoriesQuerySchema = createQuerySchema(
  ALLOWED_CATEGORY_FILTER_FIELDS,
  ALLOWED_CATEGORY_SORT_FIELDS,
);

// Helper function to get allowed operators for a field
export function getAllowedOperatorsForCategoryField(
  field: AllowedCategoryFilterField,
) {
  return getAllowedOperatorsForField(field, ALLOWED_CATEGORY_FILTER_FIELDS);
}

// Export types and constants for reference
export { ALLOWED_CATEGORY_FILTER_FIELDS, ALLOWED_CATEGORY_SORT_FIELDS };
