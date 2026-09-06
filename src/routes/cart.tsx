import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { useCart } from "@/hooks/useCart";
import { WA_NUMBER } from "@/components/contact";
import { Minus, Plus, Trash2 } from "lucide-react";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const SITE = "https://elite-jewellery-gallery.lovable.app";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Elite Jewellery Gallery" },
      { name: "description", content: "Review your selected jewellery pieces and send your order enquiry on WhatsApp." },
      { property: "og:title", content: "Your Cart | Elite Jewellery Gallery" },
      { property: "og:description", content: "Review your selected jewellery pieces and send your order enquiry on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/cart` }],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQty, removeItem, clear } = useCart();

  const orderUrl = (() => {
    const lines = [
      "Hi Elite Jewellery Gallery! I'd like to place an order enquiry for:",
      ...items.map(
        (i, idx) =>
          `${idx + 1}. ${i.name} — ${fmt.format(i.price)} × ${i.qty} = ${fmt.format(i.price * i.qty)} (${SITE}/product/${i.id})`
      ),
      `Total estimate: ${fmt.format(total)}`,
      "Please confirm availability and final pricing.",
    ];
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-4xl px-5 pb-32 pt-28 md:px-10 md:pt-32">
        <h1 className="font-serif text-4xl font-light">Your Cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">Your cart is empty. Browse the collection to find something you love.</p>
            <Link
              to="/"
              hash="collection"
              className="mt-8 inline-block rounded-full bg-gradient-gold px-7 py-3 text-sm font-medium text-white"
            >
              View Collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-8 divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 py-5">
                  <Link to="/product/$id" params={{ id: item.id }} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      to="/product/$id"
                      params={{ id: item.id }}
                      className="truncate font-serif text-lg hover:text-[var(--gold-dark)]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 font-serif text-gradient-gold">{fmt.format(item.price)}</p>
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="p-2 hover:text-[var(--gold-dark)]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="p-2 hover:text-[var(--gold-dark)]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${item.name} from cart`}
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="hidden font-serif sm:block">{fmt.format(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
              <button
                type="button"
                onClick={clear}
                className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              >
                Clear cart
              </button>
              <div className="text-right">
                <p className="text-xs tracking-luxe text-muted-foreground">ESTIMATED TOTAL</p>
                <p className="font-serif text-3xl text-gradient-gold">{fmt.format(total)}</p>
              </div>
            </div>

            <a
              href={orderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
            >
              Send Order Enquiry on WhatsApp
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Final price confirmed on enquiry · Inclusive of making charges
            </p>
          </>
        )}
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
