import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { bookingWhatsAppUrl } from "./contact";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Consultation booking dialog — collects the customer's details and opens
 * WhatsApp with a prefilled booking message so the request lands in chat.
 */
export function BookConsultationModal({ open, onClose }: BookingModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [interest, setInterest] = useState("");
  const [note, setNote] = useState("");

  // Lock page scroll and close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(bookingWhatsAppUrl({ name, phone, date, interest, note }), "_blank", "noopener,noreferrer");
    onClose();
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-[var(--gold)]";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a consultation"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-6 shadow-luxe sm:rounded-3xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-luxe text-[var(--gold-dark)]">PRIVATE APPOINTMENT</p>
            <h2 className="mt-1 font-serif text-3xl font-light">
              Book a <span className="italic text-gradient-gold">Consultation</span>
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close booking form"
            onClick={onClose}
            className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Share a few details and we'll confirm your appointment on WhatsApp right away.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="booking-name" className="mb-1 block text-xs tracking-luxe text-muted-foreground">
              YOUR NAME
            </label>
            <input
              id="booking-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="booking-phone" className="mb-1 block text-xs tracking-luxe text-muted-foreground">
                PHONE / WHATSAPP
              </label>
              <input
                id="booking-phone"
                required
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98765 43210"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="booking-date" className="mb-1 block text-xs tracking-luxe text-muted-foreground">
                PREFERRED DATE
              </label>
              <input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor="booking-interest" className="mb-1 block text-xs tracking-luxe text-muted-foreground">
              INTERESTED IN
            </label>
            <select
              id="booking-interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={inputCls}
            >
              <option value="">Select…</option>
              <option>Bridal / Wedding jewellery</option>
              <option>Rings</option>
              <option>Necklaces</option>
              <option>Earrings</option>
              <option>Bangles &amp; Bracelets</option>
              <option>Anklets</option>
              <option>Custom design</option>
              <option>Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="booking-note" className="mb-1 block text-xs tracking-luxe text-muted-foreground">
              NOTES (OPTIONAL)
            </label>
            <textarea
              id="booking-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Budget, occasion, design ideas…"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
          >
            <MessageCircle className="h-4 w-4" /> Send Booking on WhatsApp
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Opens WhatsApp with your details pre-filled — no account needed.
          </p>
        </form>
      </div>
    </div>
  );
}
