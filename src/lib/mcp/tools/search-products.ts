import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/components/products";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Full-text search across product names, descriptions, categories, and metals. Returns matching products.",
  inputSchema: {
    query: z.string().min(1).describe("Keywords to search for"),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, limit }) => {
    const q = query.toLowerCase();
    const rows = PRODUCTS.filter((p) =>
      [p.name, p.description, p.category, p.metal ?? "", p.weight ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    )
      .slice(0, limit ?? 10)
      .map(({ id, name, category, price, description }) => ({
        id, name, category, price_inr: price, description,
      }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { matches: rows, total: rows.length },
    };
  },
});