import {
  type AllowedSortFields,
  createQuerySchema,
  type FieldOperatorMap,
} from "./query-validation.helpers";

// Define allowed fields for products with their allowed operators
const ALLOWED_PRODUCT_FILTER_FIELDS = {
  id: ["eq"],
  name: ["eq", "ne", "like"],
  price: ["eq", "ne", "gt", "gte", "lt", "lte"],
  categoryId: ["eq", "ne"],
  createdAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
  updatedAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
} as const satisfies FieldOperatorMap;

const ALLOWED_PRODUCT_SORT_FIELDS = [
  "id",
  "name",
  "price",
  "createdAt",
  "updatedAt",
] as const satisfies AllowedSortFields;

// Create union types from the objects/arrays
export type AllowedProductFilterField =
  keyof typeof ALLOWED_PRODUCT_FILTER_FIELDS;
export type AllowedProductSortField =
  (typeof ALLOWED_PRODUCT_SORT_FIELDS)[number];

// Create the query schema using the factory function
export const productsQuerySchema = createQuerySchema(
  ALLOWED_PRODUCT_FILTER_FIELDS,
  ALLOWED_PRODUCT_SORT_FIELDS,
);

// Export types and constants for reference
export { ALLOWED_PRODUCT_FILTER_FIELDS, ALLOWED_PRODUCT_SORT_FIELDS };
