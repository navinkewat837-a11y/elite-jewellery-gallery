import { storefrontApiRequest } from "@/lib/shopify";

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: Array<{ url: string; altText: string | null }>;
  variants: ShopifyVariant[];
  options: Array<{ name: string; values: string[] }>;
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 6) { edges { node { url altText } } }
  variants(first: 20) {
    edges {
      node {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
  options { name values }
`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) { edges { node { ${PRODUCT_FIELDS} } } }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

type RawProduct = Omit<ShopifyProduct, "images" | "variants"> & {
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
};

function normalise(node: RawProduct): ShopifyProduct {
  return {
    ...node,
    images: node.images.edges.map((e) => e.node),
    variants: node.variants.edges.map((e) => e.node),
  };
}

export async function fetchShopifyProducts(first = 50, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, { first, query: query ?? null });
  const edges = data?.data?.products?.edges ?? [];
  return edges.map((e: { node: RawProduct }) => normalise(e.node));
}

export async function fetchShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  const node = data?.data?.product;
  return node ? normalise(node) : null;
}

export function formatMoney(amount: string | number, currencyCode = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(amount));
}
