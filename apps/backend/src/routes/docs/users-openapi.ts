import type { DescribeRouteOptions } from "hono-openapi";

import { resolver } from "hono-openapi/zod";
import usersRoute from "../users.route";

const getRootDoc: DescribeRouteOptions = {
  description: "Get all users",
  responses: {
    "200": {
      description: "Fetches all the users from the database",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "The message of the user",
              },
              allUsers: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the user",
                    },
                    email: {
                      type: "string",
                      format: "email",
                      description: "The email of the user",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const createUserDoc: DescribeRouteOptions = {
  description: "Create a new user",
  requestBody: {
    description: "User data to create a new user",
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              description: "The name of the user (minimum 3 characters)",
            },
            email: {
              type: "string",
              format: "email",
              description: "The email address of the user",
            },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
              status: {
                type: "string",
                description: "Status of the operation",
              },
              user: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                    description: "The unique identifier of the user",
                  },
                  name: {
                    type: "string",
                    description: "The name of the user",
                  },
                  email: {
                    type: "string",
                    format: "email",
                    description: "The email address of the user",
                  },
                },
              },
            },
          },
        },
      },
    },
    "400": {
      description: "Validation error",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message",
              },
            },
          },
        },
      },
    },
  },
};
