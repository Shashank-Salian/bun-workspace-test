import { BaseService } from "../core/base.service";
import { CategoriesRepository } from "../repository/categories.repository";
import type { categories } from "../schemas/categories";

const categoriesRepository = new CategoriesRepository();

export class CategoriesService extends BaseService<
  typeof categories.$inferSelect,
  CategoriesRepository
> {
  constructor() {
    super(categoriesRepository);
  }
}
