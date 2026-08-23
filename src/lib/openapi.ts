import { SITE, absoluteUrl } from "@/lib/site"

export const OPENAPI_SPEC = {
  openapi: "3.1.0",
  info: {
    title: "favi HTTP API",
    summary: "favi developer resources — search free icon libraries and export favicon packages",
    description:
      "Public favi API hosted at getfavi.vercel.app. No authentication. Search Lucide, Tabler, Phosphor, Hugeicons, and Remix Icon; export a favicon zip (SVG, ICO, apple-touch, PWA). Production is rate-limited by client IP.",
    version: "0.1.0",
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
    { url: SITE.url, description: "Production (Vercel)" },
    { url: "http://127.0.0.1:3000", description: "Local override" },
  ],
  tags: [
    { name: "health", description: "Service status" },
    { name: "icons", description: "Icon catalog search and lookup" },
    { name: "export", description: "Favicon package export" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["health"],
        operationId: "getHealth",
        summary: "Health and indexed icon count",
        responses: {
          "200": {
            description: "Service is up",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    icons: { type: "integer" },
                  },
                  required: ["status", "icons"],
                },
              },
            },
          },
          "429": { description: "Rate limited" },
          "503": { description: "Index unavailable" },
        },
      },
    },
    "/api/libraries": {
      get: {
        tags: ["icons"],
        operationId: "listLibraries",
        summary: "List icon packs, licenses, and styles",
        responses: {
          "200": {
            description: "Library list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    libraries: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Library" },
                    },
                  },
                  required: ["libraries"],
                },
              },
            },
          },
          "429": { description: "Rate limited" },
          "503": { description: "Index unavailable" },
        },
      },
    },
    "/api/icons": {
      get: {
        tags: ["icons"],
        operationId: "searchIcons",
        summary: "Search icons",
        parameters: [
          {
            name: "q",
            in: "query",
            schema: { type: "string" },
            description: "Search query; expands curated synonyms",
          },
          { name: "library", in: "query", schema: { type: "string" } },
          { name: "style", in: "query", schema: { type: "string" } },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 300, default: 96 },
          },
          {
            name: "offset",
            in: "query",
            schema: { type: "integer", minimum: 0, default: 0 },
          },
        ],
        responses: {
          "200": {
            description: "Search page",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IconSearchResponse" },
              },
            },
          },
          "429": { description: "Rate limited" },
          "503": { description: "Index unavailable" },
        },
      },
    },
    "/api/icons/{library}/{name}": {
      get: {
        tags: ["icons"],
        operationId: "getIcon",
        summary: "Exact icon lookup",
        parameters: [
          { name: "library", in: "path", required: true, schema: { type: "string" } },
          { name: "name", in: "path", required: true, schema: { type: "string" } },
          { name: "style", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Icon with SVG",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/IconItem" },
              },
            },
          },
          "404": { description: "Icon not found" },
          "429": { description: "Rate limited" },
          "503": { description: "Index unavailable" },
        },
      },
    },
    "/api/export": {
      post: {
        tags: ["export"],
        operationId: "exportFavicon",
        summary: "Export a favicon zip",
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
            content: {
              "application/zip": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
          "400": { description: "Invalid body" },
          "404": { description: "Icon not found" },
          "429": { description: "Rate limited" },
          "500": { description: "Export failed" },
        },
      },
    },
  },
  components: {
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
    },
  },
  externalDocs: {
    description: "favi developer resources",
    url: absoluteUrl("/docs"),
  },
} as const
