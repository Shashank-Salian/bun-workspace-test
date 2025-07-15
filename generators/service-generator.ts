import { toCamelCase, type SchemaInfo } from "./generator-utils";

export class ServiceGenerator {
  generateServiceTemplate(schemaInfo: SchemaInfo): string {
    const { entityName, fileName, kebabCaseFileName } = schemaInfo;
    const serviceName = `${entityName}Service`;
    const repositoryName = `${entityName}Repository`;

    return `import type { ${fileName} } from "../schemas/${kebabCaseFileName}";
import { ${repositoryName} } from "../repository/${kebabCaseFileName}.repository";
import { BaseService } from "../core/base.service";

const ${toCamelCase(repositoryName)} = new ${repositoryName}();

export class ${serviceName} extends BaseService<
  typeof ${fileName}.$inferSelect,
  ${repositoryName}
> {
  constructor() {
    super(${toCamelCase(repositoryName)});
  }
}`;
  }
}
