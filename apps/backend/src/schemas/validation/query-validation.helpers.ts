import { z } from "zod/v4";
import type { FilterConditions } from "../../core/filtering";
import { paginationParamsSchema } from "../../core/pagination";
import { parseSortAndFilterParams } from "../../core/query-parsing";
import type { SortConditions } from "../../core/sorting";

// Generic types for field definitions
export type FieldOperatorMap = Record<string, readonly string[]>;
export type AllowedSortFields = readonly string[];

// Helper function to generate filter field schemas dynamically
export function createFilterFieldSchemas<T extends FieldOperatorMap>(
  allowedFilterFields: T,
): Record<string, z.ZodOptional<z.ZodType<string | string[]>>> {
  const schemas: Record<
    string,
    z.ZodOptional<z.ZodType<string | string[]>>
  > = {};

  // Add field__operator filters
  Object.entries(allowedFilterFields).forEach(([field, operators]) => {
    operators.forEach((operator) => {
      schemas[`${field}__${operator}`] = z
        .union([z.string(), z.array(z.string())])
        .optional();
    });
  });

  return schemas;
}

// Generic filter validation function
export function validateFilters<T extends FieldOperatorMap>(
  filters: FilterConditions,
  allowedFilterFields: T,
): FilterConditions {
  return filters.filter((filter) => {
    const field = filter.field as keyof T;
    const allowedOperators = allowedFilterFields[field];
    return (
      field in allowedFilterFields &&
      allowedOperators?.includes(filter.operator)
    );
  });
}

// Generic sort validation function
export function validateSorts<T extends AllowedSortFields>(
  sorts: SortConditions,
  allowedSortFields: T,
): SortConditions {
  return sorts.filter((sort) =>
    allowedSortFields.includes(sort.field as T[number]),
  );
}

// Factory function to create consistent query schemas
export function createQuerySchema<
  TFilterFields extends FieldOperatorMap,
  TSortFields extends AllowedSortFields,
>(allowedFilterFields: TFilterFields, allowedSortFields: TSortFields) {
  return paginationParamsSchema
    .extend({
      // Sort parameters
      sort: z.union([z.string(), z.array(z.string())]).optional(),

      // Filter parameters (generated dynamically)
      ...createFilterFieldSchemas(allowedFilterFields),
    })
    .transform((query) => {
      const { page, pageSize, ...rest } = query;
      const { sorts, filters } = parseSortAndFilterParams(rest);

      // Validate filters and sorts using generic helpers
      const validatedFilters = validateFilters(filters, allowedFilterFields);
      const validatedSorts = validateSorts(sorts, allowedSortFields);

      return {
        page,
        pageSize,
        filters: validatedFilters,
        sorts: validatedSorts,
      };
    });
}
