import "dotenv/config";
// import { serve } from "@hono/node-server";
import { handle } from "hono/aws-lambda";

import app from "./app";
// import "./routes/docs/users-openapi";

// awslambda.streamifyResponse((e, resStream) => {
//   resStream.write("Hello World");
//   resStream.end();
// });

// For AWS Lambda
export const handler = handle(app);
