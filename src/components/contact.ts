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

export function quoteUrl(productName: string, price: number) {
  const msg = `Hello Elite Jewellery Gallery,\n\nI'd like to request a quote for:\n\n• ${productName}\n• Listed price: ${fmt.format(price)}\n\nPlease share availability and any current offers. Thank you!`;
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
}

export function generalWhatsAppUrl() {
  const msg = `Hello Elite Jewellery Gallery, I'd like to know more about your collection.`;
  return `https://wa.me/${PHONE_INTL}?text=${encodeURIComponent(msg)}`;
}
