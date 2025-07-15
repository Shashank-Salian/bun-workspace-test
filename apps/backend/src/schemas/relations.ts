import { relations } from "drizzle-orm/relations";
import { users } from "./users";
import { carts } from "./carts";
import { cartItems } from "./cart-items";
import { products } from "./products";
import { orders } from "./orders";
import { orderItems } from "./order-items";
import { categories } from "./categories";

export const usersRelations = relations(users, ({ many }) => ({
  carts: many(carts),
  orders: many(orders),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  category: one(categories),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
