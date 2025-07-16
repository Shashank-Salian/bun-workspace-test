import {
  and,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  notInArray,
  type SQL,
} from "drizzle-orm";

// Supported filter operators
export const FILTER_OPERATORS = {
  eq: "eq", // equals
  ne: "ne", // not equals
  gt: "gt", // greater than
  gte: "gte", // greater than or equal
  lt: "lt", // less than
  lte: "lte", // less than or equal
  like: "like", // like (case insensitive)
  in: "in", // in array
  not_in: "not_in", // not in array
} as const;

export type FilterOperator = keyof typeof FILTER_OPERATORS;

// Single filter condition
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: string | number | boolean | (string | number)[];
}

export type FilterConditions = FilterCondition[];

/**
 * Convert filter conditions to Drizzle SQL conditions
 */
export function buildFilterConditions<T extends Record<string, any>>(
  table: T,
  filters: FilterConditions,
): SQL<unknown> | undefined {
  if (!filters.length) return undefined;

  const conditions = filters.map((filter) => {
    const column = table[filter.field];
    if (!column) {
      throw new Error(`Invalid filter field: ${filter.field}`);
    }

    switch (filter.operator) {
      case "eq":
        return eq(column, filter.value);
      case "ne":
        return ne(column, filter.value);
      case "gt":
        return gt(column, filter.value);
      case "gte":
        return gte(column, filter.value);
      case "lt":
        return lt(column, filter.value);
      case "lte":
        return lte(column, filter.value);
      case "like":
        return ilike(column, `%${filter.value}%`);
      case "in":
        if (!Array.isArray(filter.value)) {
          throw new Error("'in' operator requires an array value");
        }
        return inArray(column, filter.value);
      case "not_in":
        if (!Array.isArray(filter.value)) {
          throw new Error("'not_in' operator requires an array value");
        }
        return notInArray(column, filter.value);
      default:
        throw new Error(`Unsupported filter operator: ${filter.operator}`);
    }
  });

  return conditions.length === 1 ? conditions[0] : and(...conditions);
}
