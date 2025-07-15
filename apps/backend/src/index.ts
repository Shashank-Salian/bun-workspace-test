import "dotenv/config";
import { handle } from "hono/aws-lambda";
import { serve } from "@hono/node-server";

import app from "./app";
// import "./routes/docs/users-openapi";

// For AWS Lambda
export const handler = handle(app);

// For local development
if (process.env.NODE_ENV !== "production") {
  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
}
