import { ADDRESS, EMAIL, PHONE } from "./contact";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-serif text-2xl text-white">
            Elite <span className="text-gradient-gold">Jewellery</span> Gallery
          </p>
          <p className="mt-4 text-sm text-white/70">
            Crafting heirlooms of unmatched elegance since three generations.
          </p>
        </div>
        <div>
          <p className="text-[10px] tracking-luxe text-[var(--gold-light)]">REACH US</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-[var(--gold-light)]" href={`tel:+91${PHONE}`}>+91 {PHONE}</a></li>
            <li><a className="hover:text-[var(--gold-light)]" href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li>{ADDRESS}</li>
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-luxe text-[var(--gold-light)]">EXPLORE</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#collection" className="hover:text-[var(--gold-light)]">Collection</a></li>
            <li><a href="#about" className="hover:text-[var(--gold-light)]">About</a></li>
            <li><a href="#contact" className="hover:text-[var(--gold-light)]">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/80">
        © {new Date().getFullYear()} Elite Jewellery Gallery. All rights reserved.
      </div>
    </footer>
  );
}
