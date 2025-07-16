import {
  type AllowedSortFields,
  createQuerySchema,
  type FieldOperatorMap,
} from "./query-validation.helpers";

// Define allowed fields for order items with their allowed operators
const ALLOWED_ORDER_ITEM_FILTER_FIELDS = {
  id: ["eq", "ne", "in", "not_in"],
  orderId: ["eq", "ne", "in", "not_in"],
  productId: ["eq", "ne", "in", "not_in"],
  quantity: ["eq", "ne", "gt", "gte", "lt", "lte", "in", "not_in"],
  createdAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
  updatedAt: ["eq", "ne", "gt", "gte", "lt", "lte"],
} as const satisfies FieldOperatorMap;

const ALLOWED_ORDER_ITEM_SORT_FIELDS = [
  "id",
  "orderId",
  "productId",
  "quantity",
  "createdAt",
  "updatedAt",
] as const satisfies AllowedSortFields;

// Create union types from the objects/arrays
export type AllowedOrderItemFilterField =
  keyof typeof ALLOWED_ORDER_ITEM_FILTER_FIELDS;
export type AllowedOrderItemSortField =
  (typeof ALLOWED_ORDER_ITEM_SORT_FIELDS)[number];

// Create the query schema using the factory function
export const orderItemsQuerySchema = createQuerySchema(
  ALLOWED_ORDER_ITEM_FILTER_FIELDS,
  ALLOWED_ORDER_ITEM_SORT_FIELDS,
);

// Export types and constants for reference
export { ALLOWED_ORDER_ITEM_FILTER_FIELDS, ALLOWED_ORDER_ITEM_SORT_FIELDS };
