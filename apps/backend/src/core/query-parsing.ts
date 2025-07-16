import type { FilterConditions, FilterOperator } from "./filtering";
import type { SortConditions } from "./sorting";

/**
 * Parse simple sort parameters
 * Supports: sort=field (asc) or sort=-field (desc)
 * Can be single string or array of strings
 */
export function parseSortParams(
  sortParam: string | string[] | undefined,
): SortConditions {
  const defaultSort: SortConditions = [
    { field: "createdAt", direction: "desc" },
  ];

  if (!sortParam) return defaultSort;

  const sorts = Array.isArray(sortParam) ? sortParam : [sortParam];

  const parsedSorts = sorts.map((sort) => {
    if (sort.startsWith("-")) {
      return { field: sort.slice(1), direction: "desc" as const };
    }
    return { field: sort, direction: "asc" as const };
  });

  return parsedSorts.length > 0 ? parsedSorts : defaultSort;
}

/**
 * Parse simple filter parameters using double underscore syntax
 * Supports: field__operator=value (e.g., price__gt=100, name__like=john)
 */
export function parseFilterParams(
  query: Record<string, string | string[]>,
): FilterConditions {
  const filters: FilterConditions = [];

  for (const [key, value] of Object.entries(query)) {
    // Skip non-filter parameters
    if (["page", "pageSize", "sort"].includes(key)) continue;

    // Parse field__operator syntax
    const parts = key.split("__");
    if (parts.length !== 2) continue;

    const [field, operator] = parts;

    // Validate operator
    const validOperators: FilterOperator[] = [
      "eq",
      "ne",
      "gt",
      "gte",
      "lt",
      "lte",
      "like",
      "in",
      "not_in",
    ];
    if (!validOperators.includes(operator as FilterOperator)) continue;

    // Handle array values for 'in' and 'not_in' operators
    let filterValue: string | number | boolean | (string | number)[];

    if (operator === "in" || operator === "not_in") {
      // Split comma-separated values for 'in' and 'not_in'
      const stringValue = Array.isArray(value) ? value[0] : value;
      filterValue = stringValue.split(",").map((v) => {
        const trimmed = v.trim();
        // Try to convert to number if possible
        const num = Number(trimmed);
        return !Number.isNaN(num) ? num : trimmed;
      });
    } else {
      // Single value - convert to appropriate type
      const stringValue = Array.isArray(value) ? value[0] : value;

      // Try to convert to number
      const num = Number(stringValue);
      if (!Number.isNaN(num)) {
        filterValue = num;
      } else if (stringValue === "true" || stringValue === "false") {
        filterValue = stringValue === "true";
      } else {
        filterValue = stringValue;
      }
    }

    filters.push({
      field,
      operator: operator as FilterOperator,
      value: filterValue,
    });
  }

  return filters;
}

/**
 * Main parsing function that combines all query parameter parsing
 */
export function parseSortAndFilterParams(
  query: Record<string, string | string[]>,
) {
  const sorts = parseSortParams(query.sort);
  const filters = parseFilterParams(query);

  return {
    sorts,
    filters,
  };
}
