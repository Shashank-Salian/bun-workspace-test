# Query Validation System

This directory contains validation schemas for query parameters across all entities using a clean, consistent, and reusable approach.

## Structure

### Helper Functions (`query-validation.helpers.ts`)

Contains reusable utilities for creating query validation schemas:

- `createQuerySchema()` - Factory function to generate consistent query schemas
- `validateFilters()` - Generic filter validation helper
- `validateSorts()` - Generic sort validation helper
- `createFilterFieldSchemas()` - Dynamic schema generation for filter fields
- `getAllowedOperatorsForField()` - Helper to get allowed operators for a specific field

### Entity Validation Files

Each entity has its own validation file that defines:
- **Allowed filter fields and operators** - What fields can be filtered and with which operators
- **Allowed sort fields** - What fields can be used for sorting
- **Query schema** - Generated using the helper factory function
- **Helper functions** - Entity-specific helpers for getting allowed operators

## Usage

```typescript
// Example: Using products query validation
import { productsQuerySchema } from './validation/products-query';

// The schema automatically handles:
// - Pagination (page, pageSize)
// - Sorting (sort parameter with +/- prefix)
// - Filtering (field__operator=value syntax)
const validatedQuery = productsQuerySchema.parse(queryParams);

// Result includes:
// {
//   page: number,
//   pageSize: number, 
//   filters: FilterConditions,
//   sorts: SortConditions
// }
```

## Filter Syntax

Filters use the `field__operator=value` syntax:

- `name__eq=john` - Name equals "john"
- `price__gt=100` - Price greater than 100
- `id__in=1,2,3` - ID in array [1,2,3]
- `createdAt__gte=2024-01-01` - Created at greater than or equal to date

## Sort Syntax

Sorts use the `sort` parameter:

- `sort=name` - Sort by name ascending
- `sort=-price` - Sort by price descending
- `sort=name,-price` - Sort by name ascending, then price descending

## Benefits

1. **Consistency** - All entities follow the same pattern
2. **Reusability** - Common logic is shared across entities
3. **Type Safety** - Full TypeScript support with proper types
4. **Maintainability** - Changes to validation logic only need to be made in one place
5. **Extensibility** - Easy to add new entities by following the established pattern

## Adding New Entities

1. Create a new validation file following the pattern
2. Define allowed filter fields and operators
3. Define allowed sort fields  
4. Use `createQuerySchema()` to generate the schema
5. Export types and helper functions 