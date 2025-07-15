import { BaseService } from "../core/base.service";
import { OrderItemsRepository } from "../repository/order-items.repository";
import type { orderItems } from "../schemas/order-items";

const orderItemsRepository = new OrderItemsRepository();

export class OrderItemsService extends BaseService<
  typeof orderItems.$inferSelect,
  OrderItemsRepository
> {
  constructor() {
    super(orderItemsRepository);
  }
}
