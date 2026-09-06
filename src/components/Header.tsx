import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const links = [
  { href: "#home", label: "Home" },
  { href: "#collection", label: "Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
        <a href="#home" className="flex flex-col leading-none">
          <span className="font-serif text-xl font-semibold text-charcoal md:text-2xl">
            Elite <span className="text-gradient-gold">Jewellery</span>
          </span>
          <span className="mt-0.5 text-[10px] tracking-luxe text-muted-foreground">GALLERY</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-[var(--gold-dark)]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            aria-label={`View cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
            className="relative rounded-full p-2 text-foreground/80 transition-colors hover:text-[var(--gold-dark)]"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-gold px-1 text-[10px] font-semibold text-white shadow-soft">
                {count}
              </span>
            )}
          </Link>
          <a
            href="#collection"
            className="hidden rounded-full bg-gradient-gold px-6 py-2.5 text-sm font-medium text-white shadow-soft transition-transform hover:scale-105 md:inline-block"
          >
            Shop Now
          </a>
          <button
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
