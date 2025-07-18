import { BaseRepository } from "../core/base.repository";
import { categories } from "../schemas";
import type { Category } from "../schemas/categories";

export class CategoriesRepository extends BaseRepository<
  Category,
  typeof categories
> {
  table;

  constructor() {
    super();
    this.table = categories;
  }
}
