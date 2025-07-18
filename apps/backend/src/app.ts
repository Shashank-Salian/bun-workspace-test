import { DrizzleQueryError } from "drizzle-orm/errors";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { streamSSE, streamText } from "hono/streaming";
import { customLogger } from "./middlewares/pino-logger";
import cartItemsRoute from "./routes/cart-items.route";
import categoriesRoute from "./routes/categories.route";
import orderItemsRoute from "./routes/order-items.route";
import productsRoute from "./routes/products.route";
import usersRoute from "./routes/users.route";
import { AppError } from "./utils/app-errors";
import { getDatabaseError } from "./utils/error-handler";

// import { logger as honoLogger } from "hono/logger";

// import { openAPISpecs } from "@hono/zod-openapi";
// import { swaggerUI } from "@hono/swagger-ui";
let id = 0;

const app = new Hono()
  .use(requestId())
  .use(customLogger())
  // .use(honoLogger(winstonLogger))
  .route("/users", usersRoute)
  .route("/products", productsRoute)
  .route("/categories", categoriesRoute)
  .route("/cartItems", cartItemsRoute)
  .route("/orderItems", orderItemsRoute)
  .get("/sse", async (c) => {
    return streamSSE(c, async (stream) => {
      while (true) {
        const message = `It is ${new Date().toISOString()}`;
        await stream.writeSSE({
          data: message,
          event: "time-update",
          id: String(id++),
        });
        await stream.sleep(1000);
      }
    });
  });

app.get("/", (c) => {
  c.var.logger.error("Hello Hono!!");
  return c.json({
    message: "Hello Hono!!",
    database_connected: !!process.env.DATABASE_URL,
  });
});

app.get("/streamText", (c) => {
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    await stream.writeln("Hello");
    // Wait 1 second.
    await stream.sleep(1000);
    // Write a text without a new line.
    await stream.write(`Hono!`);
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
    return getDatabaseError(err).getJsonResponse(c);
  }

  if (err instanceof AppError) {
    return err.getJsonResponse(c);
  }

  console.log("Above exception is UNHANDLED!!!!!!!");

  return new AppError().getJsonResponse(c);
});

export type AppType = typeof app;
export default app;
