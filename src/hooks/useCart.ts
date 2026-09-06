import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

const STORAGE_KEY = "ejg-cart-v1";
const CART_EVENT = "ejg-cart-change";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function useCart() {
  // Start empty so SSR and first client render match; hydrate from storage in effect.
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    const current = readCart();
    const existing = current.find((i) => i.id === item.id);
    if (existing) {
      writeCart(current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)));
    } else {
      writeCart([...current, { ...item, qty }]);
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    writeCart(readCart().filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      writeCart(readCart().filter((i) => i.id !== id));
      return;
    }
    writeCart(readCart().map((i) => (i.id === id ? { ...i, qty } : i)));
  }, []);

  const clear = useCallback(() => writeCart([]), []);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return { items, count, total, addItem, removeItem, setQty, clear };
}
