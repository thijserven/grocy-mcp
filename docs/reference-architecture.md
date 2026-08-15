# Reference architecture: `prijsprofeet-mcp`

Inspected reference: `/Users/thijs/Developer/prijsprofeet-mcp` at `dc0cd8ac2b7bd9f5e10558a57b415558ce546a4d`.

## Stack

- Node.js 22+, ESM TypeScript 5.9, npm lockfile/package manager.
- MCP SDK v2.0.0: `@modelcontextprotocol/server`, `@modelcontextprotocol/node`, and test-only `@modelcontextprotocol/client`.
- Zod 4.4 (`zod/v4`) for tool schemas.
- `dotenv`, Vitest 4, ESLint 9 flat config with `typescript-eslint`, Prettier 3.
- TypeScript uses `NodeNext`, strict mode, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes`.

## Layout and boundaries

```text
src/index.ts                  stdio entrypoint
src/http-entry.ts             authenticated HTTP entrypoint
src/server.ts                 transport-independent MCP server factory
src/http.ts                   bearer authentication and Streamable HTTP adapter
src/config.ts                 sole environment-reading boundary
src/api/client.ts             URL/auth/timeout/JSON/error translation
src/tools/definitions.ts      deterministic tool catalog
scripts/make-executable.mjs   chmod built entrypoints
tests/                        config, HTTP, server/protocol, and client tests
```

This repository preserves those boundaries. `openapi/grocy.openapi.json` is a vendored upstream snapshot; `scripts/generate-tools.mjs` produces the 87-tool catalog (the 86 spec operations plus the source-discovered OpenAPI serving endpoint) and `docs/tool-catalog.md` deterministically.

## Design patterns copied

- `createMcpServer()` registers each catalog entry with `server.registerTool` and is isolated from both transports.
- The API client appends repeatable query fields, uses `AbortSignal.timeout`, sends JSON only when a body exists, and turns malformed/error responses into typed errors including HTTP status.
- Tool handlers return readable JSON plus `structuredContent` for object responses; upstream exceptions become MCP `isError` results.
- Each endpoint's generated Zod schema describes path/query/body fields from the upstream OpenAPI document. The generic object endpoints intentionally retain a flexible `body` for entity-specific schemas.
- Stdio reserves stdout for MCP. HTTP uses a fresh stateless Streamable HTTP server/transport per request, public `/health`, and constant-time bearer-token comparison for `/mcp`.
