# Filtering and Sorting API Documentation

This document describes how to use the filtering and sorting capabilities across all entities in the API.

## Overview

All list endpoints now support:
- **Pagination** - Control page size and which page to retrieve
- **Filtering** - Filter results based on field values
- **Sorting** - Sort results by one or more fields

## Query Parameters Format

### Basic Pagination
```
GET /users?page=1&pageSize=10
```

### Filtering
Filters use nested query parameters in the format: `filter[field][operator]=value`

```
GET /users?filter[name][like]=john&filter[id][gte]=10
```

### Sorting
Sorting uses comma-separated values in the format: `sort=field:direction,field2:direction`

```
GET /users?sort=name:asc,createdAt:desc
```

### Combined Example
```
GET /users?page=1&pageSize=5&filter[name][like]=john&filter[id][gte]=10&sort=name:asc,createdAt:desc
```

## Supported Filter Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals | `filter[id][eq]=123` |
| `ne` | Not equals | `filter[status][ne]=inactive` |
| `gt` | Greater than | `filter[age][gt]=18` |
| `gte` | Greater than or equal | `filter[price][gte]=100` |
| `lt` | Less than | `filter[stock][lt]=10` |
| `lte` | Less than or equal | `filter[discount][lte]=50` |
| `like` | Case-insensitive text search | `filter[name][like]=john` |
| `in` | Value in array | `filter[category][in]=electronics,books` |
| `not_in` | Value not in array | `filter[status][not_in]=deleted,archived` |

## Sort Directions

| Direction | Description |
|-----------|-------------|
| `asc` | Ascending order |
| `desc` | Descending order (default) |

## Allowed Fields by Entity

### Users
**Filter fields:** `id`, `name`, `email`, `createdAt`, `updatedAt`
**Sort fields:** `id`, `name`, `email`, `createdAt`, `updatedAt`

### Products
**Filter fields:** `id`, `name`, `description`, `price`, `categoryId`, `stock`, `createdAt`, `updatedAt`
**Sort fields:** `id`, `name`, `price`, `categoryId`, `stock`, `createdAt`, `updatedAt`

### Categories
**Filter fields:** `id`, `name`, `description`, `createdAt`, `updatedAt`
**Sort fields:** `id`, `name`, `createdAt`, `updatedAt`

### Cart Items
**Filter fields:** `id`, `cartId`, `productId`, `quantity`, `createdAt`, `updatedAt`
**Sort fields:** `id`, `cartId`, `productId`, `quantity`, `createdAt`, `updatedAt`

### Order Items
**Filter fields:** `id`, `orderId`, `productId`, `quantity`, `createdAt`, `updatedAt`
**Sort fields:** `id`, `orderId`, `productId`, `quantity`, `createdAt`, `updatedAt`

## Example API Calls

### Get users with names containing "john"
```bash
curl "http://localhost:3000/users?filter[name][like]=john"
```

### Get products priced between $10 and $100, sorted by price
```bash
curl "http://localhost:3000/products?filter[price][gte]=10&filter[price][lte]=100&sort=price:asc"
```

### Get recent categories (created in last week)
```bash
curl "http://localhost:3000/categories?filter[createdAt][gte]=2024-01-01&sort=createdAt:desc"
```

### Get cart items for specific carts
```bash
curl "http://localhost:3000/cart-items?filter[cartId][in]=1,2,3&sort=createdAt:desc"
```

## Response Format

All list endpoints return paginated responses with this structure:

```json
{
  "success": true,
  "message": "Records fetched successfully",
  "statusCode": 200,
  "data": {
    "items": [...],
    "page": 1,
    "totalPages": 5,
    "totalItems": 50,
    "pageSize": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Default Behavior

- **Default sort:** All entities sort by `createdAt:desc` by default
- **Default pagination:** Page 1, 10 items per page
- **Maximum page size:** 100 items per page
- **Validation:** Invalid filter/sort fields will return validation errors

## Error Handling

Invalid requests will return detailed error messages:

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": {
    "field": "Invalid filter field for users"
  }
}
```

## Implementation Notes

- Filtering and sorting validation happens at the route level using Zod schemas
- Repository layer receives validated and typed parameters
- All filters are combined with AND logic
- Text searches (`like` operator) are case-insensitive
- Date/time fields support ISO 8601 format 