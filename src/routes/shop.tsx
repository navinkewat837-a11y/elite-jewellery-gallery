import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BlurImage } from "@/components/BlurImage";
import { fetchShopifyProducts, formatMoney, type ShopifyProduct } from "@/lib/shopify-catalog";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Check } from "lucide-react";

const SITE = "https://elite-jewellery-gallery.lovable.app";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Fine Jewellery Online | Elite Jewellery Gallery" },
      {
        name: "description",
        content:
          "Browse and buy handcrafted rings, necklaces, earrings, bangles and bridal anklets with secure online checkout.",
      },
      { property: "og:title", content: "Shop Fine Jewellery Online | Elite Jewellery Gallery" },
      {
        property: "og:description",
        content: "Handcrafted rings, necklaces, earrings and bridal anklets with secure online checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/shop` }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [category, setCategory] = useState<string>("All");
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchShopifyProducts(50)
      .then((p) => alive && setProducts(p))
      .catch((e) => {
        console.error(e);
        if (alive) {
          setFailed(true);
          setProducts([]);
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set((products ?? []).map((p) => p.productType).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [products]);

  const shown = useMemo(
    () => (products ?? []).filter((p) => category === "All" || p.productType === category),
    [products, category],
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
        <header className="text-center">
          <p className="text-xs tracking-luxe text-muted-foreground">ONLINE BOUTIQUE</p>
          <h1 className="mt-3 font-serif text-4xl font-light md:text-5xl">
            Shop the <span className="italic text-gradient-gold">Collection</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            Every piece is handcrafted and shipped with secure, insured delivery. Pay online at checkout.
          </p>
        </header>

        {products === null ? (
          <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-secondary/60" style={{ height: 340 }} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            {failed
              ? "We couldn’t load the boutique just now. Please refresh in a moment."
              : "No products found."}
          </p>
        ) : (
          <>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-5 py-2 text-sm transition-colors ${
                    category === c
                      ? "border-transparent bg-gradient-gold text-white"
                      : "border-border text-foreground/80 hover:border-[var(--gold)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((p) => {
                const variant = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
                const image = p.images[0];
                return (
                  <article
                    key={p.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-cream shadow-soft transition-all hover:-translate-y-1 hover:shadow-luxe"
                  >
                    <Link to="/shop/$handle" params={{ handle: p.handle }} className="block aspect-square overflow-hidden">
                      {image && (
                        <BlurImage
                          src={image.url}
                          alt={image.altText ?? p.title}
                          width={800}
                          height={800}
                          loading="lazy"
                          decoding="async"
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          wrapperClassName="h-full w-full"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[10px] tracking-luxe text-muted-foreground">
                        {p.productType?.toUpperCase()}
                      </p>
                      <Link
                        to="/shop/$handle"
                        params={{ handle: p.handle }}
                        className="mt-1 font-serif text-lg hover:text-[var(--gold-dark)]"
                      >
                        {p.title}
                      </Link>
                      <p className="mt-1 font-serif text-lg text-gradient-gold">
                        {formatMoney(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}
                      </p>
                      <button
                        type="button"
                        disabled={!variant}
                        onClick={async () => {
                          if (!variant) return;
                          setAddedId(p.id);
                          await addItem({
                            id: `shopify-${variant.id}`,
                            name: p.title,
                            price: Number(variant.price.amount),
                            image: image?.url ?? "",
                            variantId: variant.id,
                          });
                          window.setTimeout(() => setAddedId(null), 2000);
                        }}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60"
                      >
                        {addedId === p.id ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                        {addedId === p.id ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
