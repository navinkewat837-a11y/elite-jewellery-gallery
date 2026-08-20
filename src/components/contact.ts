// ---------------------------------------------------------------------------
// Contact configuration
// ---------------------------------------------------------------------------
// The WhatsApp number is read from the VITE_WHATSAPP_NUMBER environment
// variable so you can update it from Lovable → Project Settings → Secrets
// (or your .env) without editing code. The format must be the full
// international number with country code and NO "+" or spaces, e.g.
//   919340263932   (India, 93402 63932)
// If the env var is missing, we fall back to the default below so the site
// keeps working.
// ---------------------------------------------------------------------------

const DEFAULT_PHONE_INTL = "919340263932";

const RAW_ENV_PHONE =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? "";

// Strip "+", spaces, dashes and parentheses so users can paste any format.
const ENV_PHONE_INTL = RAW_ENV_PHONE.replace(/[^\d]/g, "");

export const PHONE_INTL = ENV_PHONE_INTL || DEFAULT_PHONE_INTL;

// Local-format phone (strip leading country code "91" for display in India).
export const PHONE = PHONE_INTL.startsWith("91")
  ? PHONE_INTL.slice(2)
  : PHONE_INTL;

export const EMAIL = "navinkewat837@gmail.com";
export const ADDRESS = "Amlai, Shahdol, Madhya Pradesh — 484116";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export interface QuoteOptions {
  /** e.g. "Necklaces" */
  category?: string;
  /** Selected metal / finish */
  metal?: string;
  /** Selected size (ring size, chain length, bangle size…) */
  size?: string;
  /** Approx. weight of the listed piece */
  weight?: string;
  /** Free-text customisation request from the customer */
  note?: string;
  /** Absolute or relative link to the product page */
  link?: string;
}

export function quoteUrl(productName: string, price: number, opts: QuoteOptions = {}) {
  const lines = [
    `• Product: ${productName}`,
    ...(opts.category ? [`• Category: ${opts.category}`] : []),
    `• Listed price: ${fmt.format(price)}`,
    ...(opts.weight ? [`• Weight: ${opts.weight}`] : []),
  ];

  const custom = [
    ...(opts.metal ? [`• Metal / finish: ${opts.metal}`] : []),
    ...(opts.size ? [`• Size: ${opts.size}`] : []),
    ...(opts.note ? [`• Notes: ${opts.note}`] : []),
  ];

  const msg = [
    `Hello Elite Jewellery Gallery,`,
    ``,
    `I'd like to request a quote for:`,
    ``,
    lines.join("\n"),
    ...(custom.length ? [``, `Customisation requested:`, ``, custom.join("\n")] : []),
    ...(opts.link ? [``, `Link: ${opts.link}`] : []),
    ``,
    `Please share availability and any current offers. Thank you!`,
  ].join("\n");

  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
}

export function generalWhatsAppUrl() {
  const msg = `Hello Elite Jewellery Gallery, I'd like to know more about your collection.`;
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
}
