# Query Syntax Documentation

This document describes the simplified query parameter syntax for filtering, sorting, and pagination in the API.

## Overview

The API now supports a simple, intuitive query parameter syntax that works with standard HTTP query strings. No complex JSON objects are required - everything can be expressed as simple key-value pairs.

**✅ Root-level query parameters supported:**
- `page` - Pagination
- `pageSize` - Pagination 
- `sort` - Sorting (can be used multiple times)
- `{field}` - Direct field filtering (equals)
- `{field}__{operator}` - Field filtering with specific operator

## Pagination

Basic pagination parameters:

- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10, max: 100)

**Examples:**
```
GET /products?page=2&pageSize=20
GET /users?page=1&pageSize=50
```

## Sorting

Sorting uses the `sort` parameter with a simple prefix syntax:

- `sort=field` - Sort by field in **ascending** order
- `sort=-field` - Sort by field in **descending** order (note the `-` prefix)

You can specify multiple sort fields by using multiple `sort` parameters:

**Examples:**
```
# Sort by price ascending
GET /products?sort=price

# Sort by price descending  
GET /products?sort=-price

# Sort by price ascending, then by createdAt descending
GET /products?sort=price&sort=-createdAt

# Sort by name ascending, then by updatedAt descending
GET /users?sort=name&sort=-updatedAt
```

## Filtering

Filtering uses a double-underscore syntax: `field__operator=value`

### Available Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals (default) | `name__eq=John` or `name=John` |
| `ne` | Not equals | `status__ne=inactive` |
| `gt` | Greater than | `price__gt=100` |
| `gte` | Greater than or equal | `price__gte=100` |
| `lt` | Less than | `price__lt=1000` |
| `lte` | Less than or equal | `price__lte=1000` |
| `like` | Case-insensitive partial match | `name__like=john` |
| `in` | In array (comma-separated) | `category__in=electronics,books` |
| `not_in` | Not in array | `status__not_in=draft,deleted` |

### Filter Examples

**Simple filters:**
```
# Products with price greater than 100
GET /products?price__gt=100

# Products with price less than 1000
GET /products?price__lt=1000

# Users with name containing "john" (case-insensitive)
GET /users?name__like=john

# Products not equal to "discontinued"
GET /products?status__ne=discontinued
```

**Multiple filters (AND logic):**
```
# Products with price between 100 and 1000
GET /products?price__gt=100&price__lt=1000

# Active users created after a specific date
GET /users?status=active&createdAt__gt=2024-01-01
```

**Array filters:**
```
# Products in electronics or books categories
GET /products?category__in=electronics,books

# Users not in draft or deleted status
GET /users?status__not_in=draft,deleted
```

## Combined Examples

You can combine pagination, sorting, and filtering:

```
# Get page 2 of products, 20 items per page, 
# price between 100-1000, sorted by price ascending then by name descending
GET /products?page=2&pageSize=20&price__gt=100&price__lt=1000&sort=price&sort=-name

# Get first 50 active users, sorted by creation date (newest first)
GET /users?pageSize=50&status=active&sort=-createdAt

# Search for electronics products under $500, sorted by price
GET /products?category=electronics&price__lt=500&sort=price
```

## Field-Specific Operator Validation

Each field type supports only relevant operators for better type safety:

### Products (`/products`)

| Field | Allowed Operators | Notes |
|-------|------------------|--------|
| `id` | `eq`, `ne`, `in`, `not_in` | Numeric ID operations |
| `name` | `eq`, `ne`, `like`, `in`, `not_in` | String operations with search |
| `description` | `eq`, `ne`, `like` | Text search operations |
| `price` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in` | Full numeric operations |
| `categoryId` | `eq`, `ne`, `in`, `not_in` | ID-based filtering |
| `createdAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |
| `updatedAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |

**Sort Fields:** `id`, `name`, `description`, `price`, `categoryId`, `createdAt`, `updatedAt`

### Users (`/users`) 

| Field | Allowed Operators | Notes |
|-------|------------------|--------|
| `id` | `eq`, `ne`, `in`, `not_in` | Numeric ID operations |
| `name` | `eq`, `ne`, `like`, `in`, `not_in` | String operations with search |
| `email` | `eq`, `ne`, `like`, `in`, `not_in` | Email search operations |
| `createdAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |
| `updatedAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |

**Sort Fields:** `id`, `name`, `email`, `createdAt`, `updatedAt`

### Categories (`/categories`)

| Field | Allowed Operators | Notes |
|-------|------------------|--------|
| `id` | `eq`, `ne`, `in`, `not_in` | Numeric ID operations |
| `name` | `eq`, `ne`, `like`, `in`, `not_in` | String operations with search |
| `description` | `eq`, `ne`, `like` | Text search operations |
| `createdAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |
| `updatedAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |

**Sort Fields:** `id`, `name`, `description`, `createdAt`, `updatedAt`

### Cart Items (`/cart-items`)

| Field | Allowed Operators | Notes |
|-------|------------------|--------|
| `id` | `eq`, `ne`, `in`, `not_in` | Numeric ID operations |
| `cartId` | `eq`, `ne`, `in`, `not_in` | ID-based filtering |
| `productId` | `eq`, `ne`, `in`, `not_in` | ID-based filtering |
| `quantity` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in` | Numeric operations |
| `createdAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |
| `updatedAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |

**Sort Fields:** `id`, `cartId`, `productId`, `quantity`, `createdAt`, `updatedAt`

### Order Items (`/order-items`)

| Field | Allowed Operators | Notes |
|-------|------------------|--------|
| `id` | `eq`, `ne`, `in`, `not_in` | Numeric ID operations |
| `orderId` | `eq`, `ne`, `in`, `not_in` | ID-based filtering |
| `productId` | `eq`, `ne`, `in`, `not_in` | ID-based filtering |
| `quantity` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in` | Numeric operations |
| `createdAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |
| `updatedAt` | `eq`, `ne`, `gt`, `gte`, `lt`, `lte` | Date/time comparisons |

**Sort Fields:** `id`, `orderId`, `productId`, `quantity`, `createdAt`, `updatedAt`

## Error Handling

If you use invalid fields or operators, you'll receive a clear error message:

```json
{
  "success": false,
  "message": "Invalid filter field or operator combination"
}
```

Examples of invalid operations:
- `name__gt=value` ❌ (can't use `gt` on text fields)
- `price__like=100` ❌ (can't use `like` on numeric fields)
- `invalidField=value` ❌ (field not allowed)

## Type Conversion

The API automatically converts values to appropriate types:

- **Numbers:** `price__gt=100` → `100` (number)
- **Booleans:** `active=true` → `true` (boolean) 
- **Dates:** `createdAt__gt=2024-01-01` → Date object
- **Arrays:** `category__in=electronics,books` → `["electronics", "books"]`

## TypeScript Support

The schemas now provide excellent TypeScript intellisense:

- Root-level query parameters are strictly typed
- Field-specific operators are validated at the type level
- Better autocompletion in IDEs
- Clear error messages for invalid combinations

## Migration from Old Syntax

**Old complex syntax:**
```
GET /products?filters=[{"field":"price","operator":"gt","value":100}]&sorts=[{"field":"price","direction":"asc"}]
```

**New simple syntax:**
```
GET /products?price__gt=100&sort=price
```

The new syntax is much more intuitive and follows common REST API conventions! 