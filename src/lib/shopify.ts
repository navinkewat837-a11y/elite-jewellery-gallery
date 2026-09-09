export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "elite-jewellery-gallery-os11f-86e61szk.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "30e90c59e6ed9a8b7c8aa6ecaa716876";

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    console.error("Shopify: payment required — store needs an active plan.");
    return null;
  }
  if (!response.ok) throw new Error(`Shopify HTTP error: ${response.status}`);

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }
  return data;
}

const VARIANT_BY_TITLE_QUERY = `
  query VariantByTitle($query: String!) {
    products(first: 5, query: $query) {
      edges {
        node {
          id
          title
          variants(first: 1) {
            edges { node { id availableForSale price { amount currencyCode } } }
          }
        }
      }
    }
  }
`;

/** Resolve the Shopify variant id for a catalogue product, matched by title. */
export async function findVariantIdByTitle(title: string): Promise<string | null> {
  const escaped = title.replace(/"/g, '\\"');
  const data = await storefrontApiRequest(VARIANT_BY_TITLE_QUERY, { query: `title:"${escaped}"` });
  const edges = data?.data?.products?.edges ?? [];
  const exact =
    edges.find((e: { node: { title: string } }) => e.node.title.trim() === title.trim()) ?? edges[0];
  return exact?.node?.variants?.edges?.[0]?.node?.id ?? null;
}

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } }
  }
`;

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;

type UserError = { field: string[] | null; message: string };

function isCartNotFoundError(errors: UserError[] = []): boolean {
  return errors.some(
    (e) =>
      e.message.toLowerCase().includes("cart not found") ||
      e.message.toLowerCase().includes("does not exist"),
  );
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

export async function createShopifyCart(
  variantId: string,
  quantity: number,
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity, merchandiseId: variantId }] },
  });
  const errors = data?.data?.cartCreate?.userErrors ?? [];
  if (errors.length) {
    console.error("Cart creation failed:", errors);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  const lineId = cart?.lines?.edges?.[0]?.node?.id;
  if (!cart?.checkoutUrl || !lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity, merchandiseId: variantId }],
  });
  const errors: UserError[] = data?.data?.cartLinesAdd?.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Add line failed:", errors);
    return { success: false };
  }
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges ?? [];
  const match = lines.find(
    (l: { node: { merchandise: { id: string } } }) => l.node.merchandise.id === variantId,
  );
  return { success: true, lineId: match?.node?.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const errors: UserError[] = data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Update line failed:", errors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
  const errors: UserError[] = data?.data?.cartLinesRemove?.userErrors ?? [];
  if (isCartNotFoundError(errors)) return { success: false, cartNotFound: true };
  if (errors.length) {
    console.error("Remove line failed:", errors);
    return { success: false };
  }
  return { success: true };
}

/** Returns the remaining quantity in the Shopify cart, or null if unknown. */
export async function getShopifyCartQuantity(cartId: string): Promise<number | null> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  if (!data) return null;
  const cart = data?.data?.cart;
  if (!cart) return 0;
  return cart.totalQuantity as number;
}
