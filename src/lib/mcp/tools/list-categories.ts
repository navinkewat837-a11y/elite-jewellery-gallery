import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORIES } from "@/components/products";

export default defineTool({
  name: "list_categories",
  title: "List jewellery categories",
  description: "List all product categories available at Elite Jewellery Gallery.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CATEGORIES) }],
    structuredContent: { categories: CATEGORIES },
  }),
});
void z;