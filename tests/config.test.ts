import { describe, expect, it } from "vitest";

import { loadConfig } from "../src/config.js";

describe("Grocy configuration", () => {
  it("requires an API key and HTTPS for public Grocy origins", () => {
    expect(() => loadConfig({})).toThrow("GROCY_API_KEY");
    expect(() =>
      loadConfig({
        GROCY_API_KEY: "x",
        GROCY_BASE_URL: "http://grocy.example.test",
      }),
    ).toThrow("GROCY_BASE_URL");
    expect(() =>
      loadConfig({
        GROCY_API_KEY: "x",
        GROCY_BASE_URL: "http://192.168.1.1:9283",
      }),
    ).not.toThrow();
    expect(() =>
      loadConfig({
        GROCY_API_KEY: "x",
        GROCY_BASE_URL: "http://8.8.8.8:9283",
      }),
    ).toThrow("GROCY_BASE_URL");
    expect(() =>
      loadConfig({
        GROCY_API_KEY: "x",
        GROCY_BASE_URL: "http://localhost:9283",
      }),
    ).not.toThrow();
  });
});
