import { X } from "lucide-react";
import { useEffect } from "react";
import type { Product } from "./products";
import { quoteUrl } from "./contact";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-background shadow-luxe md:grid-cols-2">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-background/90 p-2 shadow-soft hover:bg-secondary"
        >
          <X className="h-5 w-5" />
        </button>
        <img
          src={product.image}
          alt={product.name}
          width={800}
          height={800}
          className="h-64 w-full object-cover md:h-full"
        />
        <div className="flex flex-col gap-5 overflow-y-auto p-8 md:p-10">
          <span className="text-[10px] tracking-luxe text-[var(--gold-dark)]">
            {product.category.toUpperCase()}
          </span>
          <h3 className="font-serif text-3xl md:text-4xl">{product.name}</h3>
          <p className="font-serif text-3xl text-gradient-gold">{fmt.format(product.price)}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Metal</span><span>18kt Yellow Gold</span>
            </li>
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Certification</span><span>BIS Hallmarked</span>
            </li>
            <li className="flex justify-between border-b border-border py-2">
              <span className="text-muted-foreground">Make</span><span>Hand-finished</span>
            </li>
          </ul>
          <a
            href={quoteUrl(product.name, product.price)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-gradient-gold px-6 py-3.5 text-center text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
          >
            Request Quote on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
