import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlurImage } from "@/components/BlurImage";
import { ProductDialog } from "@/components/ProductDialog";
import { quoteUrl } from "@/components/contact";
import type { Product, Category } from "@/components/products";
import type { DbProduct } from "@/hooks/useDbProducts";
import type { DbCategory } from "@/hooks/useDbCategories";

export const Route = createFileRoute("/preview/$token")({
  head: () => ({
    meta: [
      { title: "Draft preview — Elite Jewellery Gallery" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewPage,
});

const fmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function PreviewPage() {
  const { token } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [active, setActive] = useState<string>("All");
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [{ data: p, error: pe }, { data: c }] = await Promise.all([
        supabase.rpc("get_preview_products", { _token: token }),
        supabase.rpc("get_preview_categories", { _token: token }),
      ]);
      if (!mounted) return;
      if (pe) {
        setError("Could not load preview.");
        setLoading(false);
        return;
      }
      const rows = (p as DbProduct[]) ?? [];
      if (rows.length === 0 && (!c || (c as unknown[]).length === 0)) {
        setError("This preview link is invalid, expired, or revoked.");
      }
      setProducts(rows);
      setCategories(((c as DbCategory[]) ?? []).filter((x) => x.visible));
      setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const asProducts: (Product & { status: DbProduct["status"] })[] = useMemo(
    () =>
      products.map((p) => ({
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
        status: p.status,
      })),
    [products],
  );

  const filters = ["All", ...categories.map((c) => c.name)];
  const items =
    active === "All" ? asProducts : asProducts.filter((p) => p.category === active);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-muted-foreground">Loading preview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-5 py-16">
        <div className="max-w-md rounded-2xl bg-background p-8 shadow-luxe text-center">
          <h1 className="font-serif text-2xl">Preview unavailable</h1>
          <p className="mt-3 text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Ask the admin who shared this link for a new one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="sticky top-0 z-40 border-b border-amber-300 bg-amber-50 px-5 py-3 text-center text-xs text-amber-900">
        <strong>Private preview</strong> — draft products are visible. This link is
        shareable but expires. Do not index.
      </div>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">
              DRAFT PREVIEW
            </span>
            <h1 className="mt-4 font-serif text-4xl font-light md:text-5xl">
              Upcoming <span className="italic text-gradient-gold">Collection</span>
            </h1>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
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

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  {p.status === "draft" && (
                    <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold tracking-luxe text-white shadow-soft">
                      DRAFT
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div>
                    <h3 className="font-serif text-2xl font-medium">{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="text-[10px] tracking-luxe text-muted-foreground">
                        FROM
                      </span>
                      <p className="font-serif text-2xl text-gradient-gold">
                        {fmt.format(p.price)}
                      </p>
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
            <p className="mt-16 text-center text-muted-foreground">
              No products in this category yet.
            </p>
          )}
        </div>
      </section>
      <ProductDialog product={selected} onClose={() => setSelected(null)} />
    </div>
  );
}