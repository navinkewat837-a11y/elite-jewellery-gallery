import { defineTool } from "@lovable.dev/mcp-js";
import { PHONE, PHONE_INTL, EMAIL, ADDRESS } from "@/components/contact";

export default defineTool({
  name: "store_info",
  title: "Store contact info",
  description: "Get store name, address, phone, WhatsApp, and email for Elite Jewellery Gallery.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const info = {
      name: "Elite Jewellery Gallery",
      address: ADDRESS,
      phone: PHONE,
      whatsapp: `https://wa.me/${PHONE_INTL}`,
      email: EMAIL,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});