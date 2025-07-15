import { toCamelCase, toPascalCase, type SchemaInfo } from "./generator-utils";
import type { GeneratorConfig } from "./generator-config";
import pluralize, { singular } from "pluralize";

export class RouteGenerator {
  generateRouteTemplate(
    schemaInfo: SchemaInfo,
    config: GeneratorConfig,
  ): string {
    const { entityName, fileName, kebabCaseFileName, content } = schemaInfo;
    const serviceName = `${entityName}Service`;
    const routeName = `${fileName}Route`;
    const pluralEntity = pluralize(toCamelCase(entityName));
    const singularEntity = toPascalCase(singular(entityName));
    const humanizedEntityName = kebabCaseFileName
      .split("-")
      .join(" ")
      .toLowerCase();
    const pluralEntityCapitalized = pluralize(entityName);

    // Get zod schemas from schemaInfo
    const { zodSchemas } = schemaInfo;

    // Generate imports
    let zodImports = "";
    if (zodSchemas.hasCreateSchema || zodSchemas.hasUpdateSchema) {
      const schemas: string[] = [];
      if (zodSchemas.hasCreateSchema) schemas.push(zodSchemas.createSchemaName);
      if (zodSchemas.hasUpdateSchema) schemas.push(zodSchemas.updateSchemaName);

      zodImports = `import { ${schemas.join(", ")} } from "${config.zodSchemaImportPath}";`;
    }

    // Generate validation lines - matching users.route.ts format exactly
    const createValidation = zodSchemas.hasCreateSchema
      ? `zValidator(
		"json",
		${zodSchemas.createSchemaName},
		createValidationHook("${entityName} validation failed"),
	),`
      : `// TODO: Add zod validation - create${entityName}Schema not found in schema file
	// zValidator(
	//   "json",
	//   create${singularEntity}Schema,
	//   createValidationHook("${entityName} validation failed"),
	// ),`;

    const updateValidation = zodSchemas.hasUpdateSchema
      ? `zValidator(
		"json",
		${zodSchemas.updateSchemaName},
		createValidationHook("${entityName} validation failed"),
	),`
      : `// TODO: Add zod validation - update${entityName}Schema not found in schema file
	// zValidator(
	//   "json",
	//   update${singularEntity}Schema,
	//   createValidationHook("${entityName} validation failed"),
	// ),`;

    const createDataAccess = zodSchemas.hasCreateSchema
      ? `const data = c.req.valid("json");`
      : `// TODO: Replace with c.req.valid("json") when zValidator is enabled
		const data = await c.req.json();`;

    const updateDataAccess = zodSchemas.hasUpdateSchema
      ? `const data = c.req.valid("json");`
      : `// TODO: Replace with c.req.valid("json") when zValidator is enabled
		const data = await c.req.json();`;

    return `import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ${serviceName} } from "../service/${kebabCaseFileName}.service";
import { ${fileName} } from "../schemas/${kebabCaseFileName}";
import { createValidationHook } from "../utils/validation";
import z from "zod/v4";
${zodImports}

const ${routeName} = new Hono();
const ${toCamelCase(serviceName)} = new ${serviceName}();

// GET /${pluralEntity} - Get all ${pluralEntity}
${routeName}.get("/", async (c) => {
	const all${pluralEntityCapitalized} = await ${toCamelCase(
    serviceName,
  )}.getAll();
	return c.json({
		message: "Successfully fetched all ${pluralEntity}",
		data: all${pluralEntityCapitalized},
	});
});

// GET /${pluralEntity}/:id - Get ${singularEntity} by ID
${routeName}.get(
	"/:id",
	zValidator(
		"param",
		z.object({ id: z.coerce.number().int("Invalid ${humanizedEntityName} ID") }),
		createValidationHook("Invalid ${humanizedEntityName} ID"),
	),
	async (c) => {
		const { id } = c.req.valid("param");
		const ${toCamelCase(singularEntity)} = await ${toCamelCase(serviceName)}.getById(id);
		return c.json({
			message: "Successfully fetched ${humanizedEntityName}",
			data: ${toCamelCase(singularEntity)},
		});
	},
);

// POST /${pluralEntity} - Create a new ${humanizedEntityName}
${routeName}.post(
	"/",
	${createValidation}
	async (c) => {
		${createDataAccess}
		const new${singularEntity} = await ${toCamelCase(serviceName)}.create(data);
		
		return c.json({
			message: "Successfully created ${humanizedEntityName}",
			data: new${singularEntity}
		}, 201);
	},
);

// PUT /${pluralEntity}/:id - Update ${humanizedEntityName}
${routeName}.put(
	"/:id",
	zValidator(
		"param",
		z.object({ id: z.coerce.number().int("Invalid ${humanizedEntityName} ID") }),
		createValidationHook("Invalid ${humanizedEntityName} ID"),
	),
	${updateValidation}
	async (c) => {
		const { id } = c.req.valid("param");
		${updateDataAccess}
		const updated${singularEntity} = await ${toCamelCase(
      serviceName,
    )}.update(id, data);

		return c.json({
			message: "Successfully updated ${humanizedEntityName}",
			data: updated${singularEntity},
		});
	},
);

// DELETE /${pluralEntity}/:id - Delete ${humanizedEntityName}
${routeName}.delete(
	"/:id",
	zValidator(
		"param",
		z.object({ id: z.coerce.number().int("Invalid ${humanizedEntityName} ID") }),
		createValidationHook("Invalid ${humanizedEntityName} ID"),
	),
	async (c) => {
		const { id } = c.req.valid("param");
		const deleted${singularEntity} = await ${toCamelCase(serviceName)}.delete(id);

		return c.json({
			message: "Successfully deleted ${humanizedEntityName}",
			data: deleted${singularEntity},
		});
	},
);

export default ${routeName};`;
  }
}
