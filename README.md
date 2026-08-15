# Grocy MCP

Native TypeScript MCP server for Grocy's REST API. It exposes all 87 discovered API operations: the 86 bundled upstream OpenAPI operations plus Grocy's OpenAPI-document endpoint, which the specification intentionally omits.

> Independent integration. It is not developed, endorsed, or supported by Grocy.

## Architecture

- Node.js >=22, TypeScript 5.9, npm, ESM
- MCP SDK 2.0.0, Zod 4.4, stdio and authenticated stateless Streamable HTTP transports
- `src/api/client.ts` owns `GROCY-API-KEY`, URL construction, JSON, timeouts, and API error translation.
- `src/tools/definitions.ts` and `docs/tool-catalog.md` are generated from `openapi/grocy.openapi.json`.

The analyzed reference architecture is documented in `docs/reference-architecture.md`.

## Tool catalog

`docs/tool-catalog.md` is the complete generated endpoint-to-tool inventory. It contains all 87 tool names, HTTP methods, upstream paths, and capabilities.

| Domain                                     | Tools |
| ------------------------------------------ | ----: |
| OpenAPI                                    |     1 |
| System                                     |     6 |
| Master data, users, files, custom entities |    22 |
| Stock                                      |    28 |
| Shopping list                              |     6 |
| Recipes                                    |     6 |
| Chores                                     |     7 |
| Batteries                                  |     5 |
| Tasks                                      |     3 |
| Calendar                                   |     2 |
| Printing                                   |     1 |

Grocy's generic `objects/{entity}` API provides master data and equipment support. Use `grocy_get_objects_by_entity`, `grocy_post_objects_by_entity`, `grocy_get_objects_by_entity_by_objectid`, `grocy_put_objects_by_entity_by_objectid`, and `grocy_delete_objects_by_entity_by_objectid` with entities such as `products`, `locations`, `equipment`, `shopping_lists`, `quantity_units`, and custom user entities.

All tools use the `grocy_<http-method>_<endpoint>` naming convention. For example, `grocy_post_stock_products_by_productid_consume`, `grocy_post_chores_by_choreid_execute`, `grocy_post_batteries_by_batteryid_charge`, and `grocy_post_tasks_by_taskid_complete`.

## Local development

```sh
cd /Users/thijs/Developer/grocy-mcp
cp .env.example .env
# Edit GROCY_BASE_URL and GROCY_API_KEY
npm install
npm run check
npm run dev
```

`npm run dev` starts stdio. stdout is the MCP protocol; diagnostics are written to stderr.

Regenerate after replacing the specification:

```sh
npm run generate:tools
npm run check
```

## Docker HTTP deployment

The image runs the authenticated Streamable HTTP entrypoint. For a local source build:

```sh
export GROCY_MCP_AUTH_TOKEN="$(openssl rand -base64 32)"
export GROCY_MCP_BIND_ADDRESS="127.0.0.1:3000"
export GROCY_BASE_URL="https://grocy.example.com"
export GROCY_API_KEY="your-grocy-api-key"
docker compose -f docker-compose.local.yaml up --build --detach
curl --fail http://127.0.0.1:3000/health
```

Connect to `http://127.0.0.1:3000/mcp` using `Authorization: Bearer <GROCY_MCP_AUTH_TOKEN>`. To use a published image, set `GROCY_MCP_IMAGE` to a reviewed immutable digest and run `docker compose up --detach`.

## Published image automation

`.github/workflows/publish-container.yaml` builds and publishes the Docker image to GitHub Container Registry on every push to `main`, a `v*` tag, or manual dispatch. It publishes both `ghcr.io/<owner>/<repository>:latest` and `ghcr.io/<owner>/<repository>:sha-<commit>`. Deploy the SHA-tagged image or, preferably, resolve that tag to an OCI manifest digest before assigning `GROCY_MCP_IMAGE`. The workflow uses GitHub's scoped `GITHUB_TOKEN`; no separate registry secret is required. If the resulting GHCR package remains private, authenticate the deployment host with `docker login ghcr.io` using a token granted `read:packages`.

## MCP client configuration

Build first:

```sh
npm run build
```

Claude Desktop or Cursor stdio configuration:

```json
{
  "mcpServers": {
    "grocy": {
      "command": "node",
      "args": ["/Users/thijs/Developer/grocy-mcp/dist/index.js"],
      "cwd": "/Users/thijs/Developer/grocy-mcp",
      "env": {
        "GROCY_BASE_URL": "https://grocy.example.com",
        "GROCY_API_KEY": "replace-with-grocy-api-key"
      }
    }
  }
}
```

For Streamable HTTP, set `GROCY_MCP_AUTH_TOKEN`, run `node dist/http-entry.js`, and configure an MCP client with `http://host:3000/mcp` plus `Authorization: Bearer <GROCY_MCP_AUTH_TOKEN>`. `GET /health` is public; every `/mcp` request requires the token.

## Configuration

| Variable               | Required  | Description                            |
| ---------------------- | --------- | -------------------------------------- |
| `GROCY_BASE_URL`       | yes       | Grocy origin (HTTPS except localhost)  |
| `GROCY_API_KEY`        | yes       | Grocy API key, sent in `GROCY-API-KEY` |
| `GROCY_TIMEOUT_MS`     | no        | Upstream timeout, default `15000`      |
| `GROCY_USER_AGENT`     | no        | Client identifier                      |
| `GROCY_MCP_AUTH_TOKEN` | HTTP only | Bearer token required by `/mcp`        |
| `GROCY_MCP_HOST`       | no        | HTTP bind host, default `0.0.0.0`      |
| `GROCY_MCP_PORT`       | no        | HTTP port, default `3000`              |

## Verification

```sh
npm run check
npm pack --dry-run
npm run inspect
```

`npm run check` runs formatting validation, ESLint, strict TypeScript checking, six Vitest tests, and the build. Tests do not contact a live Grocy instance. `npm run inspect` performs MCP discovery against the built stdio executable; calls made through Inspector are live against your configured Grocy instance.
