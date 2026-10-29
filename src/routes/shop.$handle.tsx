import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BlurImage } from "@/components/BlurImage";
import { fetchShopifyProduct, formatMoney, type ShopifyProduct } from "@/lib/shopify-catalog";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Check, ChevronLeft } from "lucide-react";

const SITE = "https://elite-jewellery-gallery.lovable.app";

export const Route = createFileRoute("/shop/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `Product | Elite Jewellery Gallery` },
      {
        name: "description",
        content: "Handcrafted jewellery with secure online checkout and insured delivery.",
      },
      { property: "og:title", content: "Product | Elite Jewellery Gallery" },
      {
        property: "og:description",
        content: "Handcrafted jewellery with secure online checkout and insured delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/shop/${params.handle}` }],
  }),
  component: ShopProductPage,
});

function ShopProductPage() {
  const { handle } = Route.useParams();
  // undefined = still loading, null = not found
  const [product, setProduct] = useState<ShopifyProduct | null | undefined>(undefined);
  const { addItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setProduct(undefined);
    setActiveImage(0);
    setSelectedVariantId(null);
    fetchShopifyProduct(handle)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  if (product === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-8 w-40 animate-pulse rounded bg-muted" />
              <div className="h-24 w-full animate-pulse rounded bg-muted" />
              <div className="h-14 w-64 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-5 pb-32 pt-32 text-center md:px-10">
          <h1 className="font-serif text-4xl font-light">Piece not found</h1>
          <p className="mt-4 text-muted-foreground">
            This piece may no longer be available in our boutique.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-medium text-white"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Shop
          </Link>
        </main>
        <Footer />
        <WhatsAppFAB />
      </div>
    );
  }

  const variant =
    product.variants.find((v) => v.id === selectedVariantId) ??
    product.variants.find((v) => v.availableForSale) ??
    product.variants[0];
  const images = product.images.length ? product.images : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 md:px-10 md:pt-32">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[var(--gold-dark)]"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl bg-cream shadow-soft">
              {images[activeImage] && (
                <BlurImage
                  src={images[activeImage].url}
                  alt={images[activeImage].altText ?? product.title}
                  width={900}
                  height={900}
                  loading="eager"
                  decoding="async"
                  wrapperClassName="aspect-square w-full"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    aria-label={`View image ${i + 1} of ${product.title}`}
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      i === activeImage ? "border-[var(--gold)]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <BlurImage
                      src={img.url}
                      alt=""
                      width={160}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      wrapperClassName="h-full w-full"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.productType && (
              <p className="text-[11px] tracking-luxe text-muted-foreground">
                {product.productType.toUpperCase()}
              </p>
            )}
            <h1 className="mt-2 font-serif text-4xl font-light md:text-5xl">{product.title}</h1>
            {variant && (
              <p className="mt-4 font-serif text-2xl text-gradient-gold">
                {formatMoney(variant.price.amount, variant.price.currencyCode)}
              </p>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {variant?.availableForSale === false
                ? "Currently unavailable — enquire for restock."
                : "In stock · Ships insured within 3–5 business days"}
            </p>

            {product.description && (
              <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                {product.description}
              </div>
            )}

            {product.variants.length > 1 && (
              <div className="mt-6">
                <p className="text-xs tracking-luxe text-muted-foreground">OPTIONS</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      disabled={!v.availableForSale}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:opacity-40 ${
                        variant?.id === v.id
                          ? "border-transparent bg-gradient-gold text-white"
                          : "border-border hover:border-[var(--gold)]"
                      }`}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!variant || !variant.availableForSale}
              onClick={async () => {
                if (!variant) return;
                setAdded(true);
                await addItem({
                  id: `shopify-${variant.id}`,
                  name: product.title,
                  price: Number(variant.price.amount),
                  image: images[0]?.url ?? "",
                  variantId: variant.id,
                });
                window.setTimeout(() => setAdded(false), 2000);
              }}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Added to Cart" : "Add to Cart"}
            </button>

            <p className="mt-6 text-xs text-muted-foreground">
              Secure checkout · Insured delivery · Easy exchanges within 7 days
            </p>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
