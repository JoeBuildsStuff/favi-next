import { SITE, absoluteUrl } from "@/lib/site"

const problemJson = {
  description: "RFC 9457 problem details",
  content: {
    "application/problem+json": {
      schema: { $ref: "#/components/schemas/Problem" },
    },
  },
} as const

const apiVersionParam = {
  name: "API-Version",
  in: "header" as const,
  required: false,
  schema: { type: "string", enum: ["1"] },
  description:
    "Optional. Canonical versioning is the URL path /api/v1/. Send 1 to declare you target v1. Unversioned /api/* is a stable alias of v1.",
}

const rateLimitHeaders = {
  "API-Version": {
    description: "Current API major version. Always 1 for this document.",
    schema: { type: "string", example: "1" },
  },
  "RateLimit-Limit": {
    description: "Maximum requests in the current window.",
    schema: { type: "integer" },
  },
  "RateLimit-Remaining": {
    description:
      "Advertised remaining quota. Production enforcement is the Vercel WAF (may 429 independently).",
    schema: { type: "integer" },
  },
  "RateLimit-Reset": {
    description: "Seconds until the advertised window resets.",
    schema: { type: "integer" },
  },
  RateLimit: {
    description: "Combined RateLimit header: limit, remaining, reset.",
    schema: { type: "string" },
  },
  "RateLimit-Policy": {
    description: "Quota and window as {limit};w={seconds}.",
    schema: { type: "string" },
  },
} as const

const retryAfterHeader = {
  "Retry-After": {
    description: "Seconds to wait before retrying (RFC 9110). Sent on HTTP 429.",
    schema: { type: "integer" },
  },
} as const

function jsonResponse(
  description: string,
  schema: Record<string, unknown>
) {
  return {
    description,
    headers: rateLimitHeaders,
    content: {
      "application/json": { schema },
    },
  }
}

function problemResponse(description: string, status: number) {
  return {
    description,
    headers: {
      ...rateLimitHeaders,
      ...(status === 429 ? retryAfterHeader : {}),
    },
    content: problemJson.content,
  }
}

const healthGet = {
  tags: ["health"],
  operationId: "getHealth",
  summary: "Health and indexed icon count",
  description:
    "Check that the favi service is available and read the number of icons currently indexed across the supported free icon libraries.",
  parameters: [apiVersionParam],
  responses: {
    "200": jsonResponse("Service is up", {
      type: "object",
      properties: {
        status: { type: "string", example: "ok" },
        icons: { type: "integer" },
      },
      required: ["status", "icons"],
    }),
    "405": problemResponse("Method not allowed", 405),
    "429": problemResponse("Rate limited", 429),
    "503": problemResponse("Index unavailable", 503),
  },
}

const librariesGet = {
  tags: ["icons"],
  operationId: "listLibraries",
  summary: "List icon packs, licenses, and styles",
  description:
    "List the icon libraries available to favi, including their slugs, licenses, attribution notes, styles, and indexed icon counts.",
  parameters: [apiVersionParam],
  responses: {
    "200": jsonResponse("Library list", {
      type: "object",
      properties: {
        libraries: {
          type: "array",
          items: { $ref: "#/components/schemas/Library" },
        },
      },
      required: ["libraries"],
    }),
    "429": problemResponse("Rate limited", 429),
    "503": problemResponse("Index unavailable", 503),
  },
}

const iconsGet = {
  tags: ["icons"],
  operationId: "searchIcons",
  summary: "Search icons",
  description:
    "Search the indexed icon catalog by text and optionally filter by library or style. The q parameter expands curated synonyms such as photo to image and trash to delete.",
  parameters: [
    apiVersionParam,
    {
      name: "q",
      in: "query" as const,
      schema: { type: "string" },
      description: "Search query; expands curated synonyms",
    },
    { name: "library", in: "query" as const, schema: { type: "string" } },
    { name: "style", in: "query" as const, schema: { type: "string" } },
    {
      name: "limit",
      in: "query" as const,
      schema: { type: "integer", minimum: 1, maximum: 300, default: 96 },
    },
    {
      name: "offset",
      in: "query" as const,
      schema: { type: "integer", minimum: 0, default: 0 },
    },
  ],
  responses: {
    "200": jsonResponse("Search page", {
      $ref: "#/components/schemas/IconSearchResponse",
    }),
    "429": problemResponse("Rate limited", 429),
    "503": problemResponse("Index unavailable", 503),
  },
}

const iconGet = {
  tags: ["icons"],
  operationId: "getIcon",
  summary: "Exact icon lookup",
  description:
    "Fetch one exact icon by its library slug and name, optionally selecting a style. The response includes the raw SVG and attribution metadata.",
  parameters: [
    apiVersionParam,
    { name: "library", in: "path" as const, required: true, schema: { type: "string" } },
    { name: "name", in: "path" as const, required: true, schema: { type: "string" } },
    { name: "style", in: "query" as const, schema: { type: "string" } },
  ],
  responses: {
    "200": jsonResponse("Icon with SVG", {
      $ref: "#/components/schemas/IconItem",
    }),
    "404": problemResponse("Icon not found", 404),
    "429": problemResponse("Rate limited", 429),
    "503": problemResponse("Index unavailable", 503),
  },
}

const exportPost = {
  tags: ["export"],
  operationId: "exportFavicon",
  summary: "Export a favicon zip",
  description:
    "Create a downloadable favicon package from an indexed icon or one to two initials. The zip contains SVG, ICO, apple-touch, Android, and PWA assets, with optional dark-mode variants.",
  parameters: [apiVersionParam],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ExportBody" },
      },
    },
  },
  responses: {
    "200": {
      description: "Zip containing SVG, ICO, apple-touch, and PWA assets",
      headers: rateLimitHeaders,
      content: {
        "application/zip": {
          schema: { type: "string", format: "binary" },
        },
      },
    },
    "400": problemResponse("Invalid body", 400),
    "404": problemResponse("Icon not found", 404),
    "405": problemResponse("Method not allowed", 405),
    "429": problemResponse("Rate limited", 429),
    "500": problemResponse("Export failed", 500),
  },
}

const indexGet = {
  tags: ["health"],
  operationId: "getApiIndex",
  summary: "favi HTTP API index",
  description:
    "Return the machine-readable entry point for the public favi API, including its canonical version, documentation URLs, error media type, and endpoint list.",
  parameters: [apiVersionParam],
  responses: {
    "200": jsonResponse("Endpoint index", {
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
        versioning: { type: "string" },
        openapi: { type: "string" },
        documentation: { type: "string" },
        endpoints: { type: "array" },
      },
    }),
  },
}

function alias(
  operation: { summary: string; operationId: string },
  v1Path: string
) {
  return {
    ...operation,
    operationId: `${operation.operationId}Alias`,
    summary: `${operation.summary} (alias of ${v1Path})`,
    description: `Stable unversioned alias of ${v1Path}. Prefer the /api/v1 path for new integrations.`,
  }
}

export const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "favi HTTP API",
    summary: "favi developer resources — search free icon libraries and export favicon packages",
    description:
      "Public favi API hosted at getfavi.vercel.app. No authentication. Search Lucide, Tabler, Phosphor, Hugeicons, and Remix Icon; export a favicon zip (SVG, ICO, apple-touch, PWA). Versioning: URL path /api/v1/ is canonical (also declared via the optional API-Version header). Unversioned /api/* aliases v1 and is not deprecated. Breaking changes ship as /api/v2/. When a version is retired, responses include Deprecation: true and Sunset: <HTTP-date> (RFC 8594) for at least 90 days. Production is rate-limited by client IP; responses include RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, RateLimit, RateLimit-Policy, and Retry-After on 429. See /docs/versioning and /docs/rate-limits.",
    version: "1.0.0",
    contact: {
      name: "favi",
      url: SITE.github,
    },
    license: {
      name: "See repository",
      url: SITE.github,
    },
  },
  servers: [
    { url: SITE.url, description: "Production (Vercel). Prefer /api/v1 paths." },
    { url: "http://127.0.0.1:3000", description: "Local override" },
  ],
  tags: [
    { name: "health", description: "Service status" },
    { name: "icons", description: "Icon catalog search and lookup" },
    { name: "export", description: "Favicon package export" },
  ],
  paths: {
    "/api/v1": { get: indexGet },
    "/api/v1/health": { get: healthGet },
    "/api/v1/libraries": { get: librariesGet },
    "/api/v1/icons": { get: iconsGet },
    "/api/v1/icons/{library}/{name}": { get: iconGet },
    "/api/v1/export": { post: exportPost },
    "/api": { get: alias(indexGet, "/api/v1") },
    "/api/health": { get: alias(healthGet, "/api/v1/health") },
    "/api/libraries": { get: alias(librariesGet, "/api/v1/libraries") },
    "/api/icons": { get: alias(iconsGet, "/api/v1/icons") },
    "/api/icons/{library}/{name}": { get: alias(iconGet, "/api/v1/icons/{library}/{name}") },
    "/api/export": { post: alias(exportPost, "/api/v1/export") },
  },
  components: {
    parameters: {
      ApiVersion: apiVersionParam,
    },
    headers: {
      ApiVersion: rateLimitHeaders["API-Version"],
      RateLimitLimit: rateLimitHeaders["RateLimit-Limit"],
      RateLimitRemaining: rateLimitHeaders["RateLimit-Remaining"],
      RateLimitReset: rateLimitHeaders["RateLimit-Reset"],
      RateLimit: rateLimitHeaders.RateLimit,
      RateLimitPolicy: rateLimitHeaders["RateLimit-Policy"],
      RetryAfter: retryAfterHeader["Retry-After"],
      Deprecation: {
        description:
          "RFC 9745 / IETF deprecation header. Sent as true when a version is retired. Not sent for v1.",
        schema: { type: "string", example: "true" },
      },
      Sunset: {
        description:
          "RFC 8594 Sunset HTTP-date when a deprecated version will be removed. Not sent for v1.",
        schema: { type: "string" },
      },
    },
    schemas: {
      Library: {
        type: "object",
        properties: {
          slug: { type: "string" },
          name: { type: "string" },
          license: { type: "string" },
          attribution_note: { type: "string" },
          icon_count: { type: "integer" },
          styles: { type: "array", items: { type: "string" } },
        },
      },
      IconItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          style: { type: "string" },
          tags: { type: "string" },
          library: { type: "string" },
          library_name: { type: "string" },
          license: { type: "string" },
          svg: { type: "string" },
          attribution_note: { type: "string" },
        },
      },
      IconSearchResponse: {
        type: "object",
        properties: {
          total: { type: "integer" },
          icons: {
            type: "array",
            items: { $ref: "#/components/schemas/IconItem" },
          },
          limit: { type: "integer" },
          offset: { type: "integer" },
        },
      },
      ExportBody: {
        type: "object",
        description:
          "Provide library+name, or text (1–2 initials). Color and plate fields are optional.",
        properties: {
          library: { type: "string", nullable: true },
          name: { type: "string", nullable: true },
          style: { type: "string" },
          text: { type: "string", nullable: true },
          bg: { type: "string", nullable: true },
          fg: { type: "string", nullable: true },
          stroke: { type: "string", nullable: true },
          fill: { type: "string", nullable: true },
          padding: { type: "number" },
          stroke_scale: { type: "number" },
          shape: {
            type: "string",
            enum: ["rounded-square", "circle", "none"],
          },
          bg_mode: { type: "string", enum: ["solid", "linear"] },
          bg_to: { type: "string", nullable: true },
          bg_angle: { type: "number" },
          include_dark_mode: { type: "boolean" },
          dark_bg: { type: "string", nullable: true },
          dark_bg_to: { type: "string", nullable: true },
          dark_fg: { type: "string", nullable: true },
          dark_stroke: { type: "string", nullable: true },
          dark_fill: { type: "string", nullable: true },
          site_name: { type: "string" },
        },
      },
      Problem: {
        type: "object",
        description:
          "RFC 9457 application/problem+json error. Machine-readable code plus human-readable detail and hint.",
        required: ["type", "title", "status", "detail", "instance", "code", "hint"],
        properties: {
          type: {
            type: "string",
            format: "uri",
            description: "Canonical error URI on /docs/errors#{code}",
          },
          title: { type: "string" },
          status: { type: "integer" },
          detail: { type: "string" },
          instance: { type: "string" },
          code: {
            type: "string",
            enum: [
              "not_found",
              "method_not_allowed",
              "invalid_json",
              "invalid_shape",
              "invalid_bg_mode",
              "invalid_text",
              "missing_export_source",
              "icon_not_found",
              "index_unavailable",
              "export_failed",
              "rate_limited",
            ],
          },
          hint: {
            type: "string",
            description: "How to recover or which request to send next",
          },
        },
      },
    },
  },
  externalDocs: {
    description: "favi developer resources",
    url: absoluteUrl("/docs"),
  },
} as const
