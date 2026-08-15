#!/usr/bin/env node
import "dotenv/config";
import { createServer } from "node:http";

import { loadHttpConfig } from "./config.js";
import { createHttpServer } from "./http.js";

const config = loadHttpConfig();
createServer(createHttpServer({ authToken: config.authToken })).listen(
  config.port,
  config.host,
  () => {
    console.error(
      `Grocy MCP HTTP server listening on ${config.host}:${String(config.port)}`,
    );
  },
);
