import { asc, desc, type SQL } from "drizzle-orm";

// Sort direction
export const SORT_DIRECTIONS = {
  asc: "asc",
  desc: "desc",
} as const;

export type SortDirection = keyof typeof SORT_DIRECTIONS;

// Single sort condition
export interface SortCondition {
  field: string;
  direction: SortDirection;
}

export type SortConditions = SortCondition[];

/**
 * Convert sort conditions to Drizzle SQL order by clauses
 */
// biome-ignore lint/suspicious/noExplicitAny: Can be any table with any columns
export function buildSortConditions<T extends Record<string, any>>(
  table: T,
  sorts: SortConditions,
): SQL<unknown>[] {
  return sorts.map((sort) => {
    const column = table[sort.field];
    if (!column) {
      throw new Error(`Invalid sort field: ${sort.field}`);
    }

    return sort.direction === "asc" ? asc(column) : desc(column);
  });
}

/**
 * Get default sort for createdAt descending
 */
export function getDefaultSort(): SortConditions {
  return [{ field: "createdAt", direction: "desc" }];
}
