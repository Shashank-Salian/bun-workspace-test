import type { categories } from "../schemas/categories";
import { CategoriesRepository } from "../repository/categories.repository";
import { BaseService } from "../core/base.service";

const categoriesRepository = new CategoriesRepository();

export class CategoriesService extends BaseService<
  typeof categories.$inferSelect,
  CategoriesRepository
> {
  constructor() {
    super(categoriesRepository);
  }
}
