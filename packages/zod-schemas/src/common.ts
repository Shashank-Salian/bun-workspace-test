import { z } from "zod";

/**
 * Common parameter validation schemas
 */

// Generic ID parameter schema for route parameters
export const idParamSchema = z.object({
  id: z.coerce.number().int("Invalid ID parameter"),
});

// If you want to create entity-specific versions with custom error messages:
export const createIdParamSchema = (entityName: string) =>
  z.object({
    id: z.coerce.number().int(`Invalid ${entityName} ID`),
  });
