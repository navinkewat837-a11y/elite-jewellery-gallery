import { useMemo, useState } from "react";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "./products";
import { ProductDialog } from "./ProductDialog";
import { quoteUrl } from "./contact";
import { BlurImage } from "./BlurImage";
import { useDbProducts } from "@/hooks/useDbProducts";
import { useDbCategories } from "@/hooks/useDbCategories";
import { usePreviewMode } from "@/hooks/usePreviewMode";

const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function Collection() {
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");
  const [selected, setSelected] = useState<Product | null>(null);
  const { enabled: previewEnabled, setPreview } = usePreviewMode();
  const { products: dbProducts } = useDbProducts({ preview: previewEnabled });
  const { categories: dbCategories } = useDbCategories({ onlyVisible: true });

  const visibleNames = dbCategories.length
    ? dbCategories.map((c) => c.name)
    : (CATEGORIES as readonly string[]);
  const filters: string[] = ["All", ...visibleNames];

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
    createdAt: p.created_at,
  }));

  const draftIds = new Set(
    dbProducts.filter((p) => p.status === "draft").map((p) => `db-${p.id}`),
  );

  const allowed = new Set(visibleNames);
  const all = [...dbAsProducts, ...PRODUCTS].filter((p) => allowed.has(p.category));
  const byCategory = active === "All" ? all : all.filter((p) => p.category === active);

  const priceBounds = useMemo(() => {
    if (!all.length) return { min: 0, max: 0 };
    const prices = all.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [all]);

  const q = query.trim().toLowerCase();
  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);

  const filtered = byCategory.filter((p) => {
    const matchesText =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q);
    const matchesMin = min === null || Number.isNaN(min) || p.price >= min;
    const matchesMax = max === null || Number.isNaN(max) || p.price <= max;
    return matchesText && matchesMin && matchesMax;
  });

  const items = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => {
          const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });
        break;
      default:
        break;
    }
    console.log("sorted", sortBy, list.slice(0, 3).map(p => `${p.name}=${p.price}`));
    return list;
  }, [filtered, sortBy]);

  const hasFilters = q !== "" || minPrice !== "" || maxPrice !== "" || active !== "All" || sortBy !== "default";
  const clearFilters = () => {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setActive("All");
    setSortBy("default");
  };

  return (
    <section id="collection" className="bg-cream py-24 md:py-32">
      {previewEnabled && (
        <div className="sticky top-16 z-40 mx-auto mb-6 flex max-w-7xl items-center justify-between gap-3 rounded-full border border-amber-300 bg-amber-50 px-5 py-2 text-xs text-amber-900 shadow-soft">
          <span>
            <strong>Preview mode</strong> — draft products are visible to admins only.
          </span>
          <button
            onClick={() => setPreview(false)}
            className="rounded-full border border-amber-400 bg-white px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
          >
            Exit preview
          </button>
        </div>
      )}
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
          {filters.map((f) => (
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

        <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4 shadow-soft md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search jewellery by name</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rings, necklaces, earrings…"
                className="w-full rounded-full border border-border bg-background px-5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-[var(--gold)]"
              />
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1">
                <span className="sr-only">Minimum price</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder={`Min ${priceBounds.min}`}
                  className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[var(--gold)]"
                />
              </label>
              <span className="text-muted-foreground">–</span>
              <label className="flex-1">
                <span className="sr-only">Maximum price</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder={`Max ${priceBounds.max}`}
                  className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[var(--gold)]"
                />
              </label>
            </div>
            <label className="md:w-44">
              <span className="sr-only">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full cursor-pointer rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--gold)]"
              >
                <option value="default">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </label>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-[var(--gold)] hover:text-[var(--gold-dark)]"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground md:text-left">
            Showing {items.length} of {all.length} pieces
          </p>
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
                {draftIds.has(p.id) && (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold tracking-luxe text-white shadow-soft">
                    DRAFT
                  </span>
                )}
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

        {items.length === 0 && (
          <div className="mt-14 rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-serif text-2xl">No pieces match your search</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different name or widen the price range.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
