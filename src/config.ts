import { isIP } from "node:net";

export interface Config {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  userAgent: string;
}

export interface HttpConfig {
  authToken: string;
  host: string;
  port: number;
}

const DEFAULT_USER_AGENT =
  "GrocyMCP/0.1 (+https://github.com/thijserven/grocy-mcp)";

function allowsInsecureHttp(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1")
    return true;

  if (isIP(host) === 4) {
    const [first = -1, second = -1] = host.split(".").map(Number);
    return (
      first === 10 ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 169 && second === 254)
    );
  }

  return isIP(host) === 6 && /^(?:fc|fd|fe80:)/.test(host);
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const apiKey = env.GROCY_API_KEY;
  if (!apiKey) throw new Error("GROCY_API_KEY must be set");

  const timeoutMs = Number(env.GROCY_TIMEOUT_MS ?? "15000");
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error("GROCY_TIMEOUT_MS must be a positive integer");
  }

  const url = new URL(env.GROCY_BASE_URL ?? "");
  if (url.protocol !== "https:" && !allowsInsecureHttp(url.hostname)) {
    throw new Error(
      "GROCY_BASE_URL must use HTTPS, except for localhost or a private IP address",
    );
  }

  return {
    apiKey,
    baseUrl: url.toString().replace(/\/$/, ""),
    timeoutMs,
    userAgent: env.GROCY_USER_AGENT ?? DEFAULT_USER_AGENT,
  };
}

export function loadHttpConfig(
  env: NodeJS.ProcessEnv = process.env,
): HttpConfig {
  const authToken = env.GROCY_MCP_AUTH_TOKEN;
  if (!authToken) throw new Error("GROCY_MCP_AUTH_TOKEN must be set");
  const port = Number(env.GROCY_MCP_PORT ?? "3000");
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new Error("GROCY_MCP_PORT must be an integer from 1 to 65535");
  }
  const host = env.GROCY_MCP_HOST ?? "0.0.0.0";
  if (!host) throw new Error("GROCY_MCP_HOST must not be empty");
  return { authToken, host, port };
}
