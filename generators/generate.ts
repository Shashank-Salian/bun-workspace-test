import { existsSync } from "node:fs";
import { join } from "node:path";
import * as readline from "node:readline";
import { RouteGenerator } from "./route-generator";
import { ServiceGenerator } from "./service-generator";
import { RepositoryGenerator } from "./repository-generator";
import {
  parseSchemaFile,
  writeFileIfNotExists,
  getProjectRoot,
} from "./generator-utils";
import { loadConfig } from "./generator-config";

export class MainGenerator {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async generate(): Promise<void> {
    try {
      console.log("🚀 Hono CRUD Route Generator");
      console.log("================================");

      // Load configuration
      const config = loadConfig();
      const projectRoot = getProjectRoot();

      const schemaFileName = await this.question(
        "Enter the schema file name (without .ts extension): ",
      );

      if (!schemaFileName.trim()) {
        console.error("Schema file name is required");
        return;
      }

      const outputFolder = await this.question(
        "Enter output subfolder in routes (optional, press Enter for root): ",
      );

      const schemaPath = join(
        projectRoot,
        config.drizzleSchemaPath,
        `${schemaFileName}.ts`,
      );

      if (!existsSync(schemaPath)) {
        console.error(`Schema file not found: ${schemaPath}`);
        return;
      }

      console.log(`📖 Reading schema file: ${schemaPath}`);
      const schemaInfo = await parseSchemaFile(schemaPath, config);

      if (!schemaInfo) {
        console.error("Failed to parse schema file");
        return;
      }

      console.log(
        `🔍 Found entity: ${schemaInfo.entityName} (table: ${schemaInfo.tableName})`,
      );

      if (
        schemaInfo.zodSchemas.hasCreateSchema ||
        schemaInfo.zodSchemas.hasUpdateSchema
      ) {
        console.log(
          `✅ Found zod schemas: create=${schemaInfo.zodSchemas.hasCreateSchema}, update=${schemaInfo.zodSchemas.hasUpdateSchema}`,
        );
      } else {
        console.log(
          "⚠️  No zod schemas found - validation will need to be added manually",
        );
      }

      // Generate Repository
      const repositoryGenerator = new RepositoryGenerator();
      const repositoryDir = join(projectRoot, config.repositoryOutputPath);
      const repositoryFilePath = join(
        repositoryDir,
        `${schemaInfo.kebabCaseFileName}.repository.ts`,
      );
      const repositoryContent =
        repositoryGenerator.generateRepositoryTemplate(schemaInfo);
      await writeFileIfNotExists(repositoryFilePath, repositoryContent);

      const serviceGenerator = new ServiceGenerator();
      const serviceDir = join(projectRoot, config.serviceOutputPath);
      const serviceFilePath = join(
        serviceDir,
        `${schemaInfo.kebabCaseFileName}.service.ts`,
      );
      const serviceContent =
        serviceGenerator.generateServiceTemplate(schemaInfo);
      await writeFileIfNotExists(serviceFilePath, serviceContent);

      const routeGenerator = new RouteGenerator();
      const routeDir = outputFolder?.trim()
        ? join(projectRoot, config.routeOutputPath, outputFolder.trim())
        : join(projectRoot, config.routeOutputPath);

      const routeFilePath = join(
        routeDir,
        `${schemaInfo.kebabCaseFileName}.route.ts`,
      );
      const routeContent = routeGenerator.generateRouteTemplate(
        schemaInfo,
        config,
      );
      await writeFileIfNotExists(routeFilePath, routeContent);

      console.log("\n🎉 Generation completed!");
      console.log("\n📝 Next steps:");
      console.log(
        "1. Import your Zod validation schemas (they may already exist in your schema file!)",
      );
      console.log("2. Uncomment the zValidator lines in your route file");
      console.log("3. Update the import path for your schemas if needed");
      console.log("4. Register the route in your main app file");
      console.log("5. Test the generated endpoints");
      console.log("\n✅ Generated files:");
      console.log(`   - Repository: ${repositoryFilePath}`);
      console.log(`   - Service: ${serviceFilePath}`);
      console.log(`   - Route: ${routeFilePath}`);
    } catch (error) {
      console.error("Error during generation:", error);
    } finally {
      this.rl.close();
    }
  }
}

// Run the generator
if (require.main === module) {
  const generator = new MainGenerator();
  generator.generate();
}
