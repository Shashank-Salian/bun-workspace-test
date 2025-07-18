import { BaseRepository } from "../core/base.repository";

import { orderItems } from "../schemas";
import type { OrderItems } from "../schemas/order-items";

export class OrderItemsRepository extends BaseRepository<
  OrderItems,
  typeof orderItems
> {
  table;

  constructor() {
    super();
    this.table = orderItems;
  }
}
