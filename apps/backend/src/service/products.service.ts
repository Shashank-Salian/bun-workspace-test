import { BaseService } from "../core/base.service";
import { ProductsRepository } from "../repository/products.repository";
import type { products } from "../schemas/products";

const productsRepository = new ProductsRepository();

export class ProductsService extends BaseService<
  typeof products.$inferSelect,
  ProductsRepository
> {
  constructor() {
    super(productsRepository);
  }
}
