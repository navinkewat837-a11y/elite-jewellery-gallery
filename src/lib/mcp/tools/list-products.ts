import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS, CATEGORIES, type Category } from "@/components/products";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List products from the Elite Jewellery Gallery catalog. Optionally filter by category or new arrivals, and limit results.",
  inputSchema: {
    category: z.enum(CATEGORIES as [Category, ...Category[]]).optional().describe("Filter by category"),
    onlyNew: z.boolean().optional().describe("Only return new arrivals"),
    limit: z.number().int().min(1).max(100).optional().describe("Max products to return (default 20)"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, onlyNew, limit }) => {
    let items = PRODUCTS.slice();
    if (category) items = items.filter((p) => p.category === category);
    if (onlyNew) items = items.filter((p) => p.isNew);
    items = items.slice(0, limit ?? 20);
    const rows = items.map(({ id, name, category, price, isNew, metal, weight, description }) => ({
      id, name, category, price_inr: price, isNew: !!isNew, metal, weight, description,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { products: rows, total: rows.length },
    };
  },
});