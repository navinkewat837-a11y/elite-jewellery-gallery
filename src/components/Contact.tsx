import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { ADDRESS, EMAIL, PHONE, generalWhatsAppUrl } from "./contact";

export function Contact() {
  return (
    <section id="contact" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] tracking-luxe text-[var(--gold-dark)]">VISIT US</span>
          <h2 className="mt-4 font-serif text-4xl font-light md:text-6xl">
            Let's <span className="italic text-gradient-gold">Connect</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Step into our atelier or reach us directly — we'd love to help you find the perfect piece.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { Icon: Phone, label: "Call / WhatsApp", value: PHONE, href: `tel:+91${PHONE}` },
            { Icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
            { Icon: MapPin, label: "Location", value: ADDRESS, href: "https://maps.google.com/?q=Amlai+Shahdol+Madhya+Pradesh+484116" },
          ].map(({ Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group rounded-2xl border border-border bg-background p-8 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-[var(--gold)] hover:shadow-luxe"
            >
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-[10px] tracking-luxe text-muted-foreground">{label.toUpperCase()}</p>
              <p className="mt-2 font-serif text-xl text-charcoal break-words">{value}</p>
            </a>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-gradient-gold p-10 text-center text-white shadow-luxe md:p-14">
          <h3 className="font-serif text-3xl md:text-4xl">Ready to find your piece?</h3>
          <p className="max-w-xl text-white/90">
            Chat with us on WhatsApp for personalised recommendations, custom designs and exclusive offers.
          </p>
          <a
            href={generalWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 text-sm font-medium text-charcoal transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" /> Message on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
