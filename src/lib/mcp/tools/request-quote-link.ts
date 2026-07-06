import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/components/products";
import { quoteUrl, generalWhatsAppUrl } from "@/components/contact";

export default defineTool({
  name: "request_quote_link",
  title: "Get WhatsApp quote link",
  description:
    "Generate a WhatsApp deep-link with a pre-filled quote request for a product id. Omit id for a general enquiry link.",
  inputSchema: {
    id: z.string().optional().describe("Product id to request a quote for"),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: ({ id }) => {
    if (!id) {
      const url = generalWhatsAppUrl();
      return { content: [{ type: "text", text: url }], structuredContent: { url } };
    }
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return { content: [{ type: "text", text: `No product with id "${id}"` }], isError: true };
    const url = quoteUrl(p.name, p.price);
    return {
      content: [{ type: "text", text: url }],
      structuredContent: { url, product: { id: p.id, name: p.name, price_inr: p.price } },
    };
  },
});