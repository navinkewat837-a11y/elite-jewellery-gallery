import { useState } from "react";
import { PRODUCTS, type Product } from "./products";
import { ProductDialog } from "./ProductDialog";
import { quoteUrl } from "./contact";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function LatestArrivals() {
  const [selected, setSelected] = useState<Product | null>(null);
  const items = PRODUCTS.filter((p) => p.isNew);

  if (items.length === 0) return null;

  return (
    <section id="latest-arrivals" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">JUST IN</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">
            Latest <span className="italic text-gradient-gold">Arrivals</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            The newest additions to our atelier — fresh expressions of timeless craft.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-cream shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="relative aspect-square overflow-hidden bg-cream">
                <img
                  src={p.image}
                  alt={p.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] tracking-luxe text-white shadow-soft">
                  NEW ARRIVAL
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <h3 className="font-serif text-2xl font-medium">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-[10px] tracking-luxe text-muted-foreground">FROM</span>
                    <p className="font-serif text-2xl text-gradient-gold">{fmt.format(p.price)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelected(p)}
                    className="rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
                  >
                    Details
                  </button>
                  <a
                    href={quoteUrl(p.name, p.price)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-gradient-gold px-4 py-2.5 text-center text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                  >
                    Request Quote
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
