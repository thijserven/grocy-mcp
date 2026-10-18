import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

/**
 * @typedef {object} OpenApiSchema
 * @property {string} [$ref]
 * @property {string} [type]
 * @property {string} [format]
 * @property {string} [description]
 * @property {unknown[]} [enum]
 * @property {OpenApiSchema[]} [oneOf]
 * @property {OpenApiSchema[]} [anyOf]
 * @property {OpenApiSchema} [items]
 * @property {Record<string, OpenApiSchema>} [properties]
 * @property {string[]} [required]
 * @property {boolean} [additionalProperties]
 */

/**
 * @typedef {object} OpenApiParameter
 * @property {string} [$ref]
 * @property {string} [name]
 * @property {string} [in]
 * @property {string} [description]
 * @property {boolean} [required]
 * @property {OpenApiSchema} [schema]
 */

/**
 * @typedef {object} OpenApiRequestBody
 * @property {string} [$ref]
 * @property {string} [description]
 * @property {boolean} [required]
 * @property {Record<string, { schema?: OpenApiSchema }>} [content]
 */

/**
 * @typedef {object} OpenApiOperation
 * @property {string} [$ref]
 * @property {string} [summary]
 * @property {string} [description]
 * @property {OpenApiParameter[]} [parameters]
 * @property {OpenApiRequestBody} [requestBody]
 */

/**
 * @typedef {object} OpenApiPathItem
 * @property {OpenApiOperation} [get]
 * @property {OpenApiOperation} [put]
 * @property {OpenApiOperation} [post]
 * @property {OpenApiOperation} [delete]
 * @property {OpenApiParameter[]} [parameters]
 */

/** @typedef {Record<string, Record<string, unknown>>} OpenApiComponents */

/**
 * @typedef {object} OpenApiSpec
 * @property {OpenApiComponents} [components]
 * @property {Record<string, OpenApiPathItem>} paths
 */

/**
 * @typedef {object} CatalogEntry
 * @property {string} method
 * @property {string} name
 * @property {string} path
 * @property {string} summary
 */

/**
 * @typedef {object} RefNode
 * @property {string} [$ref]
 */

/** @type {unknown} */
const parsedSpec = JSON.parse(
  readFileSync("openapi/grocy.openapi.json", "utf8"),
);
const spec = /** @type {OpenApiSpec} */ (parsedSpec);
const methods = new Set(["get", "post", "put", "delete"]);
/** @type {OpenApiComponents} */
const components = spec.components ?? {};
const schemas = /** @type {Record<string, OpenApiSchema>} */ (
  components.schemas ?? {}
);
const exposedEntities = schemas.ExposedEntity?.enum ?? [];
const nonListableEntities = schemas.ExposedEntityNoListing?.enum ?? [];
const nonEditableEntities = schemas.ExposedEntityNoEdit?.enum ?? [];
const nonDeletableEntities = schemas.ExposedEntityNoDelete?.enum ?? [];
// ChoresService exposes these modes; upstream's OpenAPI omits yearly and adaptive.
const chorePeriodTypes = [
  "manually",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "adaptive",
];

/**
 * @param {string} reference
 * @returns {OpenApiSchema | undefined}
 */
function generatedRuntimeSchema(reference) {
  // OpenApiController generates these component schemas per Grocy instance.
  // User-defined entities cannot be statically enumerated, so only closed
  // controller-derived sets are emitted as enums.
  if (
    reference === "#/components/schemas/ExposedEntity_NotIncludingNotListable"
  ) {
    return {
      type: "string",
      enum: exposedEntities.filter(
        (entity) => !nonListableEntities.includes(entity),
      ),
    };
  }
  if (
    reference === "#/components/schemas/ExposedEntity_NotIncludingNotEditable"
  ) {
    return {
      type: "string",
      enum: exposedEntities.filter(
        (entity) => !nonEditableEntities.includes(entity),
      ),
    };
  }
  if (
    reference === "#/components/schemas/ExposedEntity_NotIncludingNotDeletable"
  ) {
    return {
      type: "string",
      enum: exposedEntities.filter(
        (entity) => !nonDeletableEntities.includes(entity),
      ),
    };
  }
  return undefined;
}

/**
 * @template {RefNode} T
 * @param {T | undefined} value
 * @returns {T}
 */
function dereference(value) {
  if (!value?.$ref) return /** @type {T} */ (value ?? {});
  const [, , section = "", name = ""] = value.$ref.split("/");
  const resolved = /** @type {T | undefined} */ (components[section]?.[name]);
  return resolved
    ? dereference(resolved)
    : /** @type {T} */ (generatedRuntimeSchema(value.$ref) ?? {});
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function quoted(value) {
  return JSON.stringify(value);
}

// The MCP SDK validates tool arguments with the generated zod schema and zod
// objects strip unknown keys. The generic object endpoints accept any Grocy
// entity, whose columns the vendored spec may not (fully) document, so their
// request bodies must be loose objects that pass fields through to Grocy
// unchanged; Grocy is the field validator and answers unknown columns with a
// 400 error.
const LOOSE_BODY_PATHS = new Set([
  "/objects/{entity}",
  "/objects/{entity}/{objectId}",
]);

/**
 * @param {OpenApiSchema | undefined} schema
 * @param {string | undefined} [description]
 * @param {boolean} [loose]
 * @returns {string}
 */
function zod(schema, description, loose = false) {
  const source = dereference(schema);
  let output;
  if (Array.isArray(source.enum) && source.enum.length > 0) {
    const values = source.enum.map((value) => quoted(value)).join(", ");
    output = source.enum.every((value) => typeof value === "string")
      ? `z.enum([${values}])`
      : `z.union([${source.enum.map((value) => `z.literal(${quoted(value)})`).join(", ")}])`;
  } else if (source.oneOf || source.anyOf) {
    const variants = source.oneOf ?? source.anyOf ?? [];
    output = `z.union([${variants.map((variant) => zod(variant, undefined, loose)).join(", ")}])`;
  } else if (source.type === "array") {
    output = `z.array(${zod(source.items ?? {})})`;
  } else if (source.type === "integer") {
    output = "z.number().int()";
  } else if (source.type === "number") {
    output = "z.number()";
  } else if (source.type === "boolean") {
    output = "z.boolean()";
  } else if (source.type === "string") {
    output = source.format === "date-time" ? "z.iso.datetime()" : "z.string()";
  } else if (source.type === "object" || source.properties) {
    const properties = source.properties ?? {};
    const required = new Set(source.required ?? []);
    const entries = Object.entries(properties).map(([name, property]) => {
      const field = dereference(property);
      const constrainedField =
        name === "period_type" ? { ...field, enum: chorePeriodTypes } : field;
      const fieldDescription =
        constrainedField.description ?? `Grocy ${name.replaceAll("_", " ")}.`;
      return `${quoted(name)}: ${zod(constrainedField, fieldDescription)}${required.has(name) ? "" : ".optional()"}`;
    });
    output =
      entries.length > 0
        ? `${loose ? "z.looseObject" : "z.object"}({ ${entries.join(", ")} })`
        : "z.record(z.string(), z.unknown())";
  } else {
    output = "z.unknown()";
  }
  return description ? `${output}.describe(${quoted(description)})` : output;
}

/**
 * @param {string} method
 * @param {string} path
 * @returns {string}
 */
function identifier(method, path) {
  const suffix = path
    .replace(/^\//, "")
    .replaceAll("{", "by_")
    .replaceAll("}", "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
  return `grocy_${method}_${suffix}`;
}

/** @type {string[]} */
const definitions = [];
/** @type {Map<string, CatalogEntry[]>} */
const catalog = new Map();
/**
 * @param {string} path
 * @returns {string}
 */
function categoryFor(path) {
  if (path.startsWith("/system")) return "System";
  if (
    path === "/user" ||
    path.startsWith("/objects") ||
    path.startsWith("/userfields") ||
    path.startsWith("/files") ||
    path.startsWith("/users") ||
    path.startsWith("/user/")
  )
    return "Master data, users, files, and custom entities";
  if (path.startsWith("/stock/shoppinglist")) return "Shopping list";
  if (path.startsWith("/stock")) return "Stock";
  if (path.startsWith("/recipes")) return "Recipes";
  if (path.startsWith("/chores")) return "Chores";
  if (path.startsWith("/batteries")) return "Batteries";
  if (path.startsWith("/tasks")) return "Tasks";
  if (path.startsWith("/calendar")) return "Calendar";
  if (path.startsWith("/print")) return "Printing";
  return "Other";
}
for (const [path, pathItem] of Object.entries(spec.paths)) {
  for (const [method, rawOperation] of Object.entries(pathItem)) {
    if (!methods.has(method)) continue;
    const operation = dereference(
      /** @type {OpenApiOperation | undefined} */ (rawOperation),
    );
    const parameters = [
      ...(pathItem.parameters ?? []),
      ...(operation.parameters ?? []),
    ].map(dereference);
    /** @type {string[]} */
    const shape = [];
    for (const parameter of parameters) {
      const parameterDescription =
        parameter.description ??
        `${String(parameter.in)} parameter sent to Grocy.`;
      const expression = zod(parameter.schema ?? {}, parameterDescription);
      shape.push(
        `${quoted(parameter.name)}: ${expression}${parameter.required ? "" : ".optional()"}`,
      );
    }
    const requestBody = dereference(operation.requestBody);
    const media =
      requestBody.content?.["application/json"] ??
      Object.values(requestBody.content ?? {})[0];
    if (media?.schema) {
      const bodyDescription =
        requestBody.description ?? "JSON request body sent unchanged to Grocy.";
      shape.push(
        `body: ${zod(media.schema, bodyDescription, LOOSE_BODY_PATHS.has(path))}${requestBody.required ? "" : ".optional()"}`,
      );
    }
    const summary = operation.summary ?? `${method.toUpperCase()} ${path}`;
    const description =
      `${summary}. ${operation.description ?? "Calls the corresponding Grocy REST API operation."}`
        .replace(/\s+/g, " ")
        .trim();
    const name = identifier(method, path);
    definitions.push(
      `  tool(${quoted(name)}, ${quoted(summary)}, ${quoted(description)}, ${quoted(method.toUpperCase())}, ${quoted(path)}, z.object({ ${shape.join(", ")} }) as z.ZodType<Record<string, unknown>>),`,
    );
    const category = categoryFor(path);
    catalog.set(category, [
      ...(catalog.get(category) ?? []),
      { method: method.toUpperCase(), name, path, summary },
    ]);
  }
}

// The bundled OpenAPI document deliberately omits its own serving endpoint.
// Keep this source-discovered API capability in the MCP catalog as well.
const openApiDefinition = {
  method: "GET",
  name: "grocy_get_openapi_specification",
  path: "/openapi/specification",
  summary: "Returns Grocy's generated OpenAPI document",
};
definitions.push(
  `  tool(${quoted(openApiDefinition.name)}, ${quoted(openApiDefinition.summary)}, ${quoted("Returns Grocy's generated OpenAPI document. Use this to inspect the live instance API contract.")}, "GET", ${quoted(openApiDefinition.path)}, z.object({}) as z.ZodType<Record<string, unknown>>),`,
);
catalog.set("OpenAPI", [openApiDefinition]);

const output = `// Generated from openapi/grocy.openapi.json. Do not edit manually; run npm run generate:tools.\nimport * as z from "zod/v4";\n\nimport type { ApiRequest, HttpMethod, QueryValue } from "../api/client.js";\n\nexport interface ToolDefinition {\n  description: string;\n  inputSchema: z.ZodType<Record<string, unknown>>;\n  method: HttpMethod;\n  name: string;\n  request: (input: Record<string, unknown>) => ApiRequest;\n  title: string;\n}\n\nfunction tool(name: string, title: string, description: string, method: HttpMethod, path: string, inputSchema: z.ZodType<Record<string, unknown>>): ToolDefinition {\n  return { name, title, description, method, inputSchema, request: (input) => requestFor(method, path, input) };\n}\n\nfunction requestFor(method: HttpMethod, template: string, input: Record<string, unknown>): ApiRequest {\n  const path = template.replace(/\\{([^}]+)}/g, (_match, key: string) => encodeURIComponent(String(input[key])));\n  const query: Record<string, QueryValue> = {};\n  for (const [key, value] of Object.entries(input)) {\n    if (!template.includes("{" + key + "}") && key !== "body" && value !== undefined) query[key] = value as QueryValue;\n  }\n  return { method, path, ...(Object.keys(query).length > 0 ? { query } : {}), ...(input.body === undefined ? {} : { body: input.body }) };\n}\n\nexport const TOOL_DEFINITIONS: readonly ToolDefinition[] = [\n${definitions.join("\n")}\n];\n`;
mkdirSync("src/tools", { recursive: true });
mkdirSync("docs", { recursive: true });
writeFileSync("src/tools/definitions.ts", output);
const markdown = [
  "# Grocy MCP tool catalog",
  "",
  `Generated from the vendored Grocy OpenAPI specification (${String(definitions.length - 1)} operations) plus the source-discovered OpenAPI serving endpoint. Do not edit manually; run \`npm run generate:tools\`.`,
  "",
  "Equipment, products, locations, shopping lists, recipes, quantity units, and other Grocy master-data entities use the generic `grocy_*_objects_by_entity` tools. Pass the supported entity name (for example `equipment` or `products`).",
  "",
  ...[...catalog.entries()].flatMap(([category, operations]) => [
    `## ${category} (${String(operations.length)})`,
    "",
    "| Tool | Method | Grocy endpoint | Capability |",
    "| --- | --- | --- | --- |",
    ...operations.map(
      (operation) =>
        `| \`${operation.name}\` | ${operation.method} | \`${operation.path}\` | ${operation.summary} |`,
    ),
    "",
  ]),
].join("\n");
writeFileSync("docs/tool-catalog.md", markdown);
console.error(`Generated ${String(definitions.length)} Grocy MCP tools.`);
