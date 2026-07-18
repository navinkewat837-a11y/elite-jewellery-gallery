import { useState } from "react";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "./products";
import { ProductDialog } from "./ProductDialog";
import { quoteUrl } from "./contact";
import { BlurImage } from "./BlurImage";
import { useDbProducts } from "@/hooks/useDbProducts";

const FILTERS: ("All" | Category)[] = ["All", ...CATEGORIES];
const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function Collection() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const { products: dbProducts } = useDbProducts();

  const dbAsProducts: Product[] = dbProducts.map((p) => ({
    id: `db-${p.id}`,
    name: p.name,
    category: p.category as Category,
    price: Number(p.price),
    image: p.image,
    gallery: p.gallery?.length ? p.gallery : undefined,
    description: p.description,
    isNew: p.is_new,
    weight: p.weight ?? undefined,
    metal: p.metal ?? undefined,
  }));

  const all = [...dbAsProducts, ...PRODUCTS];
  const items = active === "All" ? all : all.filter((p) => p.category === active);

  return (
    <section id="collection" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">OUR COLLECTION</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">
            Curated <span className="italic text-gradient-gold">Masterpieces</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Each piece is hand-finished by master artisans in our atelier.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-5 py-2 text-sm transition-all ${
                active === f
                  ? "border-transparent bg-gradient-gold text-white shadow-soft"
                  : "border-border bg-background text-foreground/70 hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-xl bg-background shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe"
            >
              <div className="relative aspect-square overflow-hidden bg-cream">
                <BlurImage
                  src={p.image}
                  alt={p.name}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  wrapperClassName="h-full w-full"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] tracking-luxe text-[var(--gold-dark)] backdrop-blur">
                  {p.category.toUpperCase()}
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
