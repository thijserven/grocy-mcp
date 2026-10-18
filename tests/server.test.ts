import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import * as z from "zod/v4";
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

  it("uses closed Grocy option sets as enums and leaves instance-defined values open", () => {
    const listEntities = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_get_objects_by_entity",
    )?.inputSchema;
    expect(listEntities?.safeParse({ entity: "products" }).success).toBe(true);
    expect(listEntities?.safeParse({ entity: "api_keys" }).success).toBe(false);

    const file = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_get_files_by_group_by_filename",
    )?.inputSchema;
    expect(
      file?.safeParse({ group: "productpictures", fileName: "item.jpg" })
        .success,
    ).toBe(true);
    expect(
      file?.safeParse({ group: "unknown", fileName: "item.jpg" }).success,
    ).toBe(false);

    const createObject = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_post_objects_by_entity",
    )?.inputSchema;
    if (!createObject) {
      throw new Error("Expected generic create-object tool definition");
    }
    const publicSchema = JSON.stringify(z.toJSONSchema(createObject));
    expect(publicSchema).toContain('"adaptive"');
    expect(publicSchema).toContain('"yearly"');
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

  it("forwards generic entity write bodies unfiltered", () => {
    const body = { recipe_id: 1, product_id: 2, qu_id: 3, amount: 1.5 };
    for (const toolName of [
      "grocy_post_objects_by_entity",
      "grocy_put_objects_by_entity_by_objectid",
    ]) {
      const definition = TOOL_DEFINITIONS.find(({ name }) => name === toolName);
      if (!definition) {
        throw new Error(`Expected generic entity write tool ${toolName}`);
      }
      const parsed = definition.inputSchema.safeParse({
        entity: "recipes_pos",
        ...(toolName.startsWith("grocy_put") ? { objectId: 1 } : {}),
        body,
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.body).toEqual(body);
      }
    }
    const createObject = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_post_objects_by_entity",
    );
    if (!createObject) {
      throw new Error("Expected generic create-object tool definition");
    }
    expect(createObject.request({ entity: "recipes_pos", body })).toEqual({
      method: "POST",
      path: "/objects/recipes_pos",
      body,
    });
    const publicSchema = JSON.stringify(
      z.toJSONSchema(createObject.inputSchema),
    );
    expect(publicSchema).toContain("recipe_id");
    expect(publicSchema).toContain("only_check_single_unit_in_stock");
  });

  it("still validates entity-specific bodies strictly", () => {
    const definition = TOOL_DEFINITIONS.find(
      ({ name }) => name === "grocy_post_stock_products_by_productid_consume",
    );
    const parsed = definition?.inputSchema.safeParse({
      productId: 3,
      body: { amount: "not-a-number" },
    });
    expect(parsed?.success).toBe(false);
  });

  it("preserves unrecognized generic entity fields through SDK input validation", async () => {
    const request = vi.fn(() => Promise.resolve({ created_object_id: "42" }));
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

    const body = {
      recipe_id: 2,
      product_id: 16,
      amount: 2,
      qu_id: 3,
      note: "ingredient row",
    };
    const result = await client.callTool({
      name: "grocy_post_objects_by_entity",
      arguments: { entity: "recipes_pos", body },
    });
    expect(result.isError ?? false).toBe(false);
    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/objects/recipes_pos",
      body,
    });
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
