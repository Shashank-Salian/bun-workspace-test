import { z } from "zod";

export const categoriesSchema = z.object({
	id: z
		.number()
		.int({ message: "ID must be an integer" })
		.min(1, { message: "ID must be a positive number" }),

	name: z
		.string("Name is required")
		.min(1, { message: "Category name cannot be empty" })
		.max(255, { message: "Category name cannot exceed 255 characters" }),

	description: z
		.string()
		.min(1, { message: "Description cannot be empty" })
		.max(512, { message: "Description cannot exceed 512 characters" }),
});

export const createCategorySchema = categoriesSchema.omit({
	id: true,
});

export const updateCategorySchema = categoriesSchema.partial({
	name: true,
	description: true,
});

export type Category = z.infer<typeof categoriesSchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
