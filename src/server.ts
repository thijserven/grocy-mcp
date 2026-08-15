import { McpServer } from "@modelcontextprotocol/server";
import { createRequire } from "node:module";

import { GrocyClient } from "./api/client.js";
import { loadConfig } from "./config.js";
import { TOOL_DEFINITIONS } from "./tools/definitions.js";

const { name, version } = createRequire(import.meta.url)("../package.json") as {
  name: string;
  version: string;
};

export interface ServerDependencies {
  apiClient?: GrocyClient;
}

export function createMcpServer(
  dependencies: ServerDependencies = {},
): McpServer {
  const apiClient = dependencies.apiClient ?? new GrocyClient(loadConfig());
  const server = new McpServer(
    { name, version },
    {
      capabilities: { tools: {} },
      instructions:
        "Native Grocy REST API bridge. Use read tools to inspect IDs and current state before mutations. Mutation tools apply immediately to the configured Grocy household.",
    },
  );

  for (const definition of TOOL_DEFINITIONS) {
    server.registerTool(
      definition.name,
      {
        title: definition.title,
        description: definition.description,
        inputSchema: definition.inputSchema,
        annotations: {
          readOnlyHint: definition.method === "GET",
          destructiveHint: definition.method === "DELETE",
          idempotentHint:
            definition.method === "GET" ||
            definition.method === "PUT" ||
            definition.method === "DELETE",
          openWorldHint: true,
        },
      },
      async (input) => {
        try {
          const data = await apiClient.request(definition.request(input));
          return {
            content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            ...(isRecord(data) ? { structuredContent: data } : {}),
          };
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          return { content: [{ type: "text", text: message }], isError: true };
        }
      },
    );
  }
  return server;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
