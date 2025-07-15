import { serve } from "@hono/node-server";
import { usersSchema } from "@zod-schemas";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { Hono } from "hono";
import cartItemsRoute from "./routes/cart-items.route";
import categoriesRoute from "./routes/categories.route";
import orderItemsRoute from "./routes/order-items.route";
import productsRoute from "./routes/products.route";
import usersRoute from "./routes/users.route";
import { Prettify } from "./types/types";
import { AppError, DatabaseError } from "./utils/app-errors";
import { getPgErrorMessageByCode } from "./utils/error-handler";

// import { openAPISpecs } from "@hono/zod-openapi";
// import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono()
  .route("/users", usersRoute)
  .route("/products", productsRoute)
  .route("/categories", categoriesRoute)
  .route("/cartItems", cartItemsRoute)
  .route("/orderItems", orderItemsRoute);

app.get("/", (c) => {
  return c.json({
    message: "Hello Hono!!",
    database_connected: !!process.env.DATABASE_URL,
  });
});

// OpenAPI documentation (temporarily disabled)
// app.get(
//   "/openapi",
//   openAPISpecs(app, {
//     documentation: {
//       info: {
//         title: "Hono API",
//         version: "1.0.0",
//         description: "Greeting API",
//       },
//       servers: [{ url: "http://localhost:3000", description: "Local Server" }],
//     },
//   }),
// );

// app.get("/ui", swaggerUI({ url: "/openapi", title: "Hono API" }));

app.onError((err, c) => {
  console.log(
    "---------------------ERROR---------------------\n\n",
    err,
    "\n\n---------------------ERROR---------------------",
  );

  if (err instanceof DrizzleQueryError) {
    const message = getPgErrorMessageByCode(err) ?? "Something went wrong!";
    return new DatabaseError(message, err).getJsonResponse(c);
  }

  if (err instanceof AppError) {
    return err.getJsonResponse(c);
  }

  console.log("Above exception is UNHANDLED!!!!!!!");

  return new AppError().getJsonResponse(c);
});

// serve(app);

export type AppType = typeof app;
export default app;
