import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { GrocyClient } from "../src/api/client.js";
import { createMcpServer } from "../src/server.js";
import { TOOL_DEFINITIONS } from "../src/tools/definitions.js";

describe("Grocy MCP server", () => {
  const closers: (() => Promise<void>)[] = [];
  afterEach(async () => Promise.all(closers.splice(0).map((close) => close())));

  it("has one uniquely named native tool for each OpenAPI operation", () => {
    expect(TOOL_DEFINITIONS).toHaveLength(87);
    expect(new Set(TOOL_DEFINITIONS.map(({ name }) => name)).size).toBe(87);
    expect(TOOL_DEFINITIONS.map(({ name }) => name)).toContain(
      "grocy_get_openapi_specification",
    );
    expect(TOOL_DEFINITIONS.map(({ name }) => name)).toContain(
      "grocy_post_stock_products_by_productid_consume",
    );
    expect(TOOL_DEFINITIONS.map(({ name }) => name)).toContain(
      "grocy_post_chores_by_choreid_execute",
    );
    expect(TOOL_DEFINITIONS.map(({ name }) => name)).toContain(
      "grocy_post_batteries_by_batteryid_charge",
    );
    expect(TOOL_DEFINITIONS.map(({ name }) => name)).toContain(
      "grocy_post_tasks_by_taskid_complete",
    );
  });

  it("keeps paths encoded, query fields separate, and JSON bodies intact", () => {
    const definition = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_post_stock_products_by_productid_consume",
    );
    expect(definition?.request({ productId: 3, body: { amount: 1 } })).toEqual({
      method: "POST",
      path: "/stock/products/3/consume",
      body: { amount: 1 },
    });
    const list = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_get_objects_by_entity",
    );
    expect(list?.request({ entity: "products", limit: 20, offset: 0 })).toEqual(
      {
        method: "GET",
        path: "/objects/products",
        query: { limit: 20, offset: 0 },
      },
    );
  });

  it("exposes the generated tool catalog and translates upstream errors into MCP tool errors", async () => {
    const request = vi.fn(() =>
      Promise.reject(new Error("Grocy API returned 401: invalid API key")),
    );
    const server = createMcpServer({
      apiClient: { request } as unknown as GrocyClient,
    });
    const client = new Client({ name: "test-client", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
    closers.push(
      () => client.close(),
      () => server.close(),
    );

    expect((await client.listTools()).tools).toHaveLength(87);
    const result = await client.callTool({
      name: "grocy_get_system_info",
      arguments: {},
    });
    expect(result).toMatchObject({
      isError: true,
      content: [
        { type: "text", text: "Grocy API returned 401: invalid API key" },
      ],
    });
  });
});
