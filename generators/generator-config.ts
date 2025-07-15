export interface GeneratorConfig {
  // Path to drizzle schemas (relative to project root)
  drizzleSchemaPath: string;
  // Path to zod schemas (relative to project root)
  zodSchemaPath: string;
  // Whether zod schemas are in separate files from drizzle schemas
  separateZodFiles: boolean;
  // Path for repository output (relative to project root)
  repositoryOutputPath: string;
  // Path for service output (relative to project root)
  serviceOutputPath: string;
  // Path for route output (relative to project root)
  routeOutputPath: string;
  zodSchemaImportPath: string;
}

// Default configuration
// export const defaultConfig: GeneratorConfig = {
//   drizzleSchemaPath: "src/schemas",
//   zodSchemaPath: "packages/zod-schemas/src",
//   separateZodFiles: true,
// };

// Load configuration
export function loadConfig(): GeneratorConfig {
  // Customize these paths as needed for your project structure
  // All paths are relative to the monorepo root
  return {
    // Path to your Drizzle table schemas
    drizzleSchemaPath: "apps/backend/src/schemas",

    // Path to your Zod validation schemas (can be same or different)
    zodSchemaPath: "packages/zod-schemas/src",

    // Set to true if you keep zod schemas in separate files
    separateZodFiles: true,

    // Output paths for generated files
    repositoryOutputPath: "apps/backend/src/repository",
    serviceOutputPath: "apps/backend/src/service",
    routeOutputPath: "apps/backend/src/routes",

    // Import path for zod schemas
    zodSchemaImportPath: "@zod-schemas",
  };
}
