import type { Config } from "../config.js";

export type HttpMethod = "DELETE" | "GET" | "POST" | "PUT";
export type QueryValue =
  | boolean
  | number
  | string
  | readonly string[]
  | undefined;

export interface ApiRequest {
  body?: unknown;
  method: HttpMethod;
  path: string;
  query?: Readonly<Record<string, QueryValue>>;
}

export class GrocyApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "GrocyApiError";
  }
}

export class GrocyClient {
  constructor(private readonly config: Config) {}

  async request(request: ApiRequest): Promise<unknown> {
    const url = new URL(`/api${request.path}`, `${this.config.baseUrl}/`);
    appendQuery(url, request.query);
    const headers: Record<string, string> = {
      Accept: "application/json",
      "GROCY-API-KEY": this.config.apiKey,
      "User-Agent": this.config.userAgent,
    };
    if (request.body !== undefined)
      headers["Content-Type"] = "application/json";

    let response: Response;
    try {
      response = await fetch(url, {
        method: request.method,
        headers,
        ...(request.body === undefined
          ? {}
          : { body: JSON.stringify(request.body) }),
        signal: AbortSignal.timeout(this.config.timeoutMs),
      });
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new GrocyApiError(`Grocy API request failed: ${detail}`);
    }

    const raw = await response.text();
    const payload = parseResponse(raw, response.headers.get("content-type"));
    if (!response.ok) {
      throw new GrocyApiError(
        `Grocy API returned ${String(response.status)}: ${errorMessage(payload, raw)}`,
        response.status,
      );
    }
    return payload;
  }
}

function appendQuery(url: URL, query: ApiRequest["query"]): void {
  if (!query) return;
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value]) {
      url.searchParams.append(key, String(item));
    }
  }
}

function parseResponse(raw: string, contentType: string | null): unknown {
  if (raw === "") return null;
  if (!contentType?.includes("application/json")) return raw;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new GrocyApiError("Grocy API returned malformed JSON");
  }
}

function errorMessage(payload: unknown, raw: string): string {
  if (isRecord(payload)) {
    for (const key of ["error_message", "message", "error"]) {
      if (typeof payload[key] === "string") return payload[key].slice(0, 500);
    }
  }
  return (
    (typeof payload === "string" ? payload : raw).slice(0, 500) ||
    "Unknown error"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
