import { BaseService } from "../core/base.service";
import { CartItemsRepository } from "../repository/cart-items.repository";
import type { cartItems } from "../schemas/cart-items";

const cartItemsRepository = new CartItemsRepository();

export class CartItemsService extends BaseService<
  typeof cartItems.$inferSelect,
  CartItemsRepository
> {
  constructor() {
    super(cartItemsRepository);
  }
}
