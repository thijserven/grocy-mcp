import { afterEach, describe, expect, it, vi } from "vitest";

import { GrocyApiError, GrocyClient } from "../src/api/client.js";

describe("GrocyClient", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the Grocy API-key header, API base path, query arrays, and JSON bodies", async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ created_object_id: 1 }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new GrocyClient({
      baseUrl: "https://grocy.example.test/base",
      apiKey: "secret",
      timeoutMs: 1_000,
      userAgent: "GrocyMCP/test",
    });

    await client.request({
      method: "POST",
      path: "/objects/products",
      query: { query: ["name~foo", "active=1"] },
      body: { name: "Milk" },
    });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      URL,
      RequestInit,
    ];
    expect(url.toString()).toBe(
      "https://grocy.example.test/api/objects/products?query=name%7Efoo&query=active%3D1",
    );
    expect(init.headers).toMatchObject({
      "GROCY-API-KEY": "secret",
      "Content-Type": "application/json",
      "User-Agent": "GrocyMCP/test",
    });
    expect(init.body).toBe('{"name":"Milk"}');
  });

  it("returns Grocy HTTP status and API error payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error_message: "Unknown product" }), {
            status: 404,
            headers: { "content-type": "application/json" },
          }),
        ),
      ),
    );
    const client = new GrocyClient({
      baseUrl: "https://grocy.example.test",
      apiKey: "secret",
      timeoutMs: 1_000,
      userAgent: "GrocyMCP/test",
    });

    await expect(
      client.request({ method: "GET", path: "/stock/products/1" }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<GrocyApiError>>({
        name: "GrocyApiError",
        status: 404,
        message: "Grocy API returned 404: Unknown product",
      }),
    );
  });
});
