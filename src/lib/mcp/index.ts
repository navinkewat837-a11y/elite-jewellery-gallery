import { defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import searchProductsTool from "./tools/search-products";
import requestQuoteLinkTool from "./tools/request-quote-link";
import storeInfoTool from "./tools/store-info";

export default defineMcp({
  name: "elite-jewellery-gallery-mcp",
  title: "Elite Jewellery Gallery MCP",
  version: "0.1.0",
  instructions:
    "Tools for browsing the Elite Jewellery Gallery catalog. Use `list_categories` and `list_products` (optionally filtered by category or new arrivals) to explore inventory, `search_products` for keyword lookup, `get_product` for full details on one item, `request_quote_link` to generate a pre-filled WhatsApp quote link, and `store_info` for contact details.",
  tools: [
    listCategoriesTool,
    listProductsTool,
    getProductTool,
    searchProductsTool,
    requestQuoteLinkTool,
    storeInfoTool,
  ],
});