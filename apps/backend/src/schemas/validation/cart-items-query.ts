import {
  type AllowedSortFields,
  createQuerySchema,
  type FieldOperatorMap,
} from "./query-validation.helpers";

// Define allowed fields for cart items with their allowed operators
const ALLOWED_CART_ITEM_FILTER_FIELDS = {
  id: ["eq", "ne", "in", "not_in"],
  cartId: ["eq", "ne", "in", "not_in"],
  productId: ["eq", "ne", "in", "not_in"],
  quantity: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "not_in"],
  createdAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
  updatedAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
} as const satisfies FieldOperatorMap;

const ALLOWED_CART_ITEM_SORT_FIELDS = [
  "id",
  "cartId",
  "productId",
  "quantity",
  "createdAt",
  "updatedAt",
] as const satisfies AllowedSortFields;

// Create union types from the objects/arrays
export type AllowedCartItemFilterField =
  keyof typeof ALLOWED_CART_ITEM_FILTER_FIELDS;
export type AllowedCartItemSortField =
  (typeof ALLOWED_CART_ITEM_SORT_FIELDS)[number];

// Create the query schema using the factory function
export const cartItemsQuerySchema = createQuerySchema(
  ALLOWED_CART_ITEM_FILTER_FIELDS,
  ALLOWED_CART_ITEM_SORT_FIELDS,
);

// Export types and constants for reference
export { ALLOWED_CART_ITEM_FILTER_FIELDS, ALLOWED_CART_ITEM_SORT_FIELDS };
