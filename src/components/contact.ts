export const PHONE = "9340263932";
export const PHONE_INTL = "919340263932";
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
