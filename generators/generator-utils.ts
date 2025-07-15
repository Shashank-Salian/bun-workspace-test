import { readFile, writeFile, existsSync, mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { promisify } from "node:util";
import pluralize from "pluralize";
import type { GeneratorConfig } from "./generator-config";

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

// Type definition for Drizzle table structure
interface DrizzleTable {
  [key: string]: unknown;
}

// Type guard to check if an object is a Drizzle table
function isDrizzleTable(obj: unknown): obj is DrizzleTable {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  // Check for the Drizzle table symbol
  const symbols = Object.getOwnPropertySymbols(obj);
  return symbols.some((symbol) =>
    symbol.toString().includes("drizzle:IsDrizzleTable"),
  );
}

// Helper function to get table name from Drizzle table
function getTableName(table: DrizzleTable): string {
  const symbols = Object.getOwnPropertySymbols(table);
  const nameSymbol = symbols.find((symbol) =>
    symbol.toString().includes("drizzle:Name"),
  );
  return nameSymbol
    ? ((table as Record<symbol, unknown>)[nameSymbol] as string)
    : "";
}

// Helper function to get columns from Drizzle table
function getTableColumns(table: DrizzleTable): Record<string, unknown> {
  const symbols = Object.getOwnPropertySymbols(table);
  const columnsSymbol = symbols.find((symbol) =>
    symbol.toString().includes("drizzle:Columns"),
  );
  return columnsSymbol
    ? ((table as Record<symbol, unknown>)[columnsSymbol] as Record<
        string,
        unknown
      >)
    : {};
}

export interface SchemaInfo {
  tableName: string;
  entityName: string;
  fileName: string;
  kebabCaseFileName: string;
  columns: string[];
  hasId: boolean;
  content: string;
  constraints: { [key: string]: string };
  zodSchemas: {
    hasCreateSchema: boolean;
    hasUpdateSchema: boolean;
    createSchemaName: string;
    updateSchemaName: string;
    zodImportPath?: string; // Import path for zod schemas when separate
  };
}

export async function parseSchemaFile(
  filePath: string,
  config?: GeneratorConfig,
): Promise<SchemaInfo | null> {
  try {
    // Read the file content for backward compatibility (some generators might need it)
    const content = await readFileAsync(filePath, "utf-8");

    // Convert file path to module path for dynamic import
    const modulePath = `${filePath}`;

    // Dynamically import the schema module
    const schemaModule = await import(modulePath);

    // Find the pgTable export by looking for objects with Drizzle table structure
    let tableExport: DrizzleTable | null = null;
    let exportName = "";
    let tableName = "";

    for (const [key, value] of Object.entries(schemaModule)) {
      // Check if this export has the drizzle table structure
      if (isDrizzleTable(value)) {
        tableExport = value;
        exportName = key;
        tableName = getTableName(value) || key; // Use drizzle table name or fallback to export name
        break;
      }
    }

    if (!tableExport) {
      console.error("Could not find pgTable export in the schema file");
      return null;
    }

    // Extract column names from the table columns
    const columns: string[] = Object.keys(getTableColumns(tableExport));
    const hasId = columns.includes("id");

    const entityName = toPascalCase(exportName);
    const kebabCaseFileName = toKebabCase(exportName);

    // Extract constraints from the constraints object
    const constraints: { [key: string]: string } = {};
    const constraintsObjectName = `${exportName}Constraints`;

    if (schemaModule[constraintsObjectName]) {
      const constraintsObj = schemaModule[constraintsObjectName];
      Object.assign(constraints, constraintsObj);
    }

    // Detect zod schemas
    const zodSchemas = await detectZodSchemas(
      content,
      exportName,
      filePath,
      config,
    );

    return {
      tableName,
      entityName,
      fileName: exportName,
      kebabCaseFileName,
      columns,
      hasId,
      content,
      constraints,
      zodSchemas,
    };
  } catch (error) {
    console.error("Error parsing schema file:", error);
    return null;
  }
}

export function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

export function getProjectRoot(startPath: string = process.cwd()): string {
  return process.cwd();
}

// Helper function to detect zod schemas
async function detectZodSchemas(
  drizzleContent: string,
  entityName: string,
  drizzleFilePath: string,
  config?: GeneratorConfig,
): Promise<{
  hasCreateSchema: boolean;
  hasUpdateSchema: boolean;
  createSchemaName: string;
  updateSchemaName: string;
  zodImportPath?: string;
}> {
  const createSchemaName = `create${toPascalCase(
    pluralize.singular(entityName),
  )}Schema`;
  const updateSchemaName = `update${toPascalCase(
    pluralize.singular(entityName),
  )}Schema`;
  console.log(createSchemaName, updateSchemaName);

  if (!config || !config.separateZodFiles) {
    // Look in the same file as drizzle schema
    const hasCreateSchema = drizzleContent.includes(
      `export const ${createSchemaName}`,
    );
    const hasUpdateSchema = drizzleContent.includes(
      `export const ${updateSchemaName}`,
    );

    return {
      hasCreateSchema,
      hasUpdateSchema,
      createSchemaName,
      updateSchemaName,
    };
  }

  // Look in separate zod schema file
  const zodFileName = toKebabCase(entityName);
  const projectRoot = getProjectRoot();
  const zodFilePath = join(
    projectRoot,
    config.zodSchemaPath,
    `${zodFileName}.ts`,
  );

  if (!existsSync(zodFilePath)) {
    console.log(`⚠️  Zod schema file not found: ${zodFilePath}`);
    return {
      hasCreateSchema: false,
      hasUpdateSchema: false,
      createSchemaName,
      updateSchemaName,
      zodImportPath: `${config.zodSchemaPath}/${zodFileName}`,
    };
  }

  // Read and check separate zod file
  const zodContent = await readFileAsync(zodFilePath, "utf-8");
  const hasCreateSchema = zodContent.includes(
    `export const ${createSchemaName}`,
  );
  const hasUpdateSchema = zodContent.includes(
    `export const ${updateSchemaName}`,
  );

  return {
    hasCreateSchema,
    hasUpdateSchema,
    createSchemaName,
    updateSchemaName,
    zodImportPath: `${config.zodSchemaPath}/${zodFileName}`,
  };
}

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export async function writeFileIfNotExists(
  filePath: string,
  content: string,
): Promise<boolean> {
  if (existsSync(filePath)) {
    console.log(`⚠️  File already exists: ${filePath}`);
    return false;
  }

  await ensureDirectoryExists(filePath);
  await writeFileAsync(filePath, content, "utf-8");
  console.log(`✅ Generated: ${filePath}`);
  return true;
}
