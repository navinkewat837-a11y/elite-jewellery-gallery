# Elite Jewellery Gallery MCP

Model Context Protocol (MCP) server for browsing the **Elite Jewellery Gallery** catalog. Connect via the `/mcp` endpoint.

---

## Available Tools

### 1. `list_categories`

List all product categories available in the catalog.

**Parameters**: none

**Example call**:

```json
{
  "name": "list_categories",
  "arguments": {}
}
```

**Example output**:

```json
{
  "categories": [
    "Rings",
    "Necklaces",
    "Earrings",
    "Bracelets",
    "Bangles",
    "Anklets"
  ]
}
```

---

### 2. `list_products`

Browse products with optional filters.

| Parameter | Type    | Required | Description                              |
|-----------|---------|----------|------------------------------------------|
| `category` | string  | no       | Filter by category (e.g. `"Rings"`)      |
| `onlyNew`  | boolean | no       | Only return new arrivals                 |
| `limit`    | number  | no       | Max results to return (default 20)       |

**Example — all new arrivals (limited to 3)**:

```json
{
  "name": "list_products",
  "arguments": {
    "onlyNew": true,
    "limit": 3
  }
}
```

**Example output**:

```json
{
  "products": [
    {
      "id": "new1",
      "name": "Pink Floral Luxe Set",
      "category": "Necklaces",
      "price_inr": 78500,
      "isNew": true,
      "metal": null,
      "weight": null,
      "description": "An exquisite floral-inspired luxe set featuring a blush-pink centre stone surrounded by a halo of brilliant diamonds, complemented by matching earrings — crafted for unforgettable occasions."
    },
    {
      "id": "new2",
      "name": "Rosé Blossom Tennis Bracelet",
      "category": "Bracelets",
      "price_inr": 89500,
      "isNew": true,
      "metal": null,
      "weight": null,
      "description": "A statement tennis bracelet adorned with vivid pink sapphires and pavé diamond florals, set in lustrous rose gold — a romantic heirloom in the making."
    },
    {
      "id": "new3",
      "name": "Papillon Cascade Earrings",
      "category": "Earrings",
      "price_inr": 32500,
      "isNew": true,
      "metal": null,
      "weight": null,
      "description": "Crystal butterflies take flight with cascading rose-gold tassels and pink sapphire droplets — graceful, weightless, and unforgettable."
    }
  ],
  "total": 3
}
```

**Example — rings category only**:

```json
{
  "name": "list_products",
  "arguments": {
    "category": "Rings",
    "limit": 2
  }
}
```

---

### 3. `get_product`

Get full details for a single product by its ID.

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `id`      | string | yes      | Product ID, e.g. `"ank1"` or `"r2"` |

**Example call**:

```json
{
  "name": "get_product",
  "arguments": {
    "id": "ank4"
  }
}
```

**Example output**:

```json
{
  "product": {
    "id": "ank4",
    "name": "Royal Sapphire & Pearl Bridal Anklet",
    "category": "Anklets",
    "price": 84500,
    "image": "...",
    "isNew": true,
    "metal": "22kt Gold Plated with Sapphires & Pearls",
    "weight": "Pair · approx. 95–110 g",
    "description": "A regal bridal anklet of sapphire-blue paisleys and pavé crystal scallops, hung with luminous baroque pearls and pink kundan teardrops — couture craftsmanship for the modern maharani."
  }
}
```

---

### 4. `search_products`

Full-text search across product names, descriptions, categories, and metals.

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `query`   | string | yes      | Keywords to search for             |
| `limit`   | number | no       | Max results (default 10)           |

**Example call**:

```json
{
  "name": "search_products",
  "arguments": {
    "query": "ruby",
    "limit": 2
  }
}
```

**Example output**:

```json
{
  "matches": [
    {
      "id": "new2",
      "name": "Rosé Blossom Tennis Bracelet",
      "category": "Bracelets",
      "price_inr": 89500,
      "description": "A statement tennis bracelet adorned with vivid pink sapphires and pavé diamond florals, set in lustrous rose gold — a romantic heirloom in the making."
    },
    {
      "id": "ank3",
      "name": "Ruby Blossom Floral Payal",
      "category": "Anklets",
      "price_inr": 26500,
      "description": "Delicate silver chains draped with ruby-red enamel flowers and faceted bead drops — a romantic everyday-bridal pair that flatters every saree, lehenga and silk drape."
    }
  ],
  "total": 2
}
```

---

### 5. `request_quote_link`

Generate a WhatsApp deep-link with a pre-filled quote request for a product. Omit `id` for a general enquiry link.

| Parameter | Type   | Required | Description                        |
|-----------|--------|----------|------------------------------------|
| `id`      | string | no       | Product ID to request a quote for  |

**Example call — with product**:

```json
{
  "name": "request_quote_link",
  "arguments": {
    "id": "new5"
  }
}
```

**Example output**:

```json
{
  "url": "https://wa.me/919340263932?text=Hello%20Elite%20Jewellery%20Gallery%2C%0A%0AI'd%20like%20to%20request%20a%20quote%20for%3A%0A%0A%E2%80%A2%20Royal%20Sapphire%20Halo%20Ring%0A%E2%80%A2%20Listed%20price%3A%20%E2%82%B92%2C15%2C000%0A%0APlease%20share%20availability%20and%20any%20current%20offers.%20Thank%20you!",
  "product": {
    "id": "new5",
    "name": "Royal Sapphire Halo Ring",
    "price_inr": 215000
  }
}
```

**Example call — general enquiry**:

```json
{
  "name": "request_quote_link",
  "arguments": {}
}
```

**Example output**:

```json
{
  "url": "https://wa.me/919340263932?text=Hello%20Elite%20Jewellery%20Gallery%2C%20I'd%20like%20to%20know%20more%20about%20your%20collection."
}
```

---

### 6. `store_info`

Get store contact details.

**Parameters**: none

**Example call**:

```json
{
  "name": "store_info",
  "arguments": {}
}
```

**Example output**:

```json
{
  "name": "Elite Jewellery Gallery",
  "address": "Amlai, Shahdol, Madhya Pradesh — 484116",
  "phone": "9340263932",
  "whatsapp": "https://wa.me/919340263932",
  "email": "navinkewat837@gmail.com"
}
```

---

## Endpoints

| Endpoint | Description                        |
|----------|------------------------------------|
| `/mcp`   | MCP Streamable HTTP endpoint       |

---

## Local Development

```bash
bun install
bun dev
```

The MCP server runs at `http://localhost:8080/mcp` alongside the app.
