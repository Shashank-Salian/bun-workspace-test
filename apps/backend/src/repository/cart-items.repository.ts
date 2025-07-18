import { BaseRepository } from "../core/base.repository";
import { cartItems } from "../schemas";
import type { CartItems } from "../schemas/cart-items";

export class CartItemsRepository extends BaseRepository<
  CartItems,
  typeof cartItems
> {
  table;

  constructor() {
    super();
    this.table = cartItems;
  }
}
