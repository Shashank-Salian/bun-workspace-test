import { BaseRepository } from "../core/base.repository";
import { products } from "../schemas";
import type { Product } from "../schemas/products";

export class ProductsRepository extends BaseRepository<
  Product,
  typeof products
> {
  table;

  constructor() {
    super();
    this.table = products;
  }
}
