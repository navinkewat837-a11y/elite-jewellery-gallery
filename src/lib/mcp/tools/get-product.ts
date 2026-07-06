import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/components/products";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description: "Get full details for a single product by its id.",
  inputSchema: {
    id: z.string().min(1).describe("The product id, e.g. 'ank1' or 'new2'"),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) {
      return { content: [{ type: "text", text: `No product with id "${id}"` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(p, null, 2) }],
      structuredContent: { product: p },
    };
  },
});