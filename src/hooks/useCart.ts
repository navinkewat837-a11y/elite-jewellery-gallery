import { useCallback, useEffect, useState } from "react";
import {
  addLineToShopifyCart,
  createShopifyCart,
  findVariantIdByTitle,
  getShopifyCartQuantity,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
} from "@/lib/shopify";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  /** Shopify variant id (gid://...) once resolved */
  variantId?: string | null;
  /** Shopify cart line id once synced */
  lineId?: string | null;
}

interface CartState {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
}

const STORAGE_KEY = "ejg-cart-v1";
const CART_EVENT = "ejg-cart-change";
const EMPTY: CartState = { items: [], cartId: null, checkoutUrl: null };

function readState(): CartState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    // Legacy format: a bare array of items.
    if (Array.isArray(parsed)) return { ...EMPTY, items: parsed };
    if (parsed && Array.isArray(parsed.items)) {
      return {
        items: parsed.items,
        cartId: parsed.cartId ?? null,
        checkoutUrl: parsed.checkoutUrl ?? null,
      };
    }
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeState(state: CartState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent(CART_EVENT));
}

export function useCart() {
  // Start empty so SSR and first client render match; hydrate from storage in effect.
  const [state, setState] = useState<CartState>(EMPTY);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const sync = () => setState(readState());
    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const addItem = useCallback(async (item: Omit<CartItem, "qty">, qty = 1) => {
    const current = readState();
    const existing = current.items.find((i) => i.id === item.id);

    // Optimistic local update so the badge responds instantly.
    const optimistic: CartState = existing
      ? {
          ...current,
          items: current.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)),
        }
      : { ...current, items: [...current.items, { ...item, qty }] };
    writeState(optimistic);

    setIsLoading(true);
    try {
      const variantId = existing?.variantId ?? item.variantId ?? (await findVariantIdByTitle(item.name));
      if (!variantId) {
        console.error("No Shopify variant found for", item.name);
        return;
      }

      const latest = readState();
      if (!latest.cartId) {
        const created = await createShopifyCart(variantId, existing ? existing.qty + qty : qty);
        if (!created) return;
        writeState({
          cartId: created.cartId,
          checkoutUrl: created.checkoutUrl,
          items: readState().items.map((i) =>
            i.id === item.id ? { ...i, variantId, lineId: created.lineId } : i,
          ),
        });
        return;
      }

      const line = latest.items.find((i) => i.id === item.id);
      if (line?.lineId) {
        const res = await updateShopifyCartLine(latest.cartId, line.lineId, line.qty);
        if (res.cartNotFound) writeState({ ...readState(), cartId: null, checkoutUrl: null });
        return;
      }

      const res = await addLineToShopifyCart(latest.cartId, variantId, qty);
      if (res.cartNotFound) {
        writeState({ ...readState(), cartId: null, checkoutUrl: null });
        return;
      }
      if (res.success) {
        const s = readState();
        writeState({
          ...s,
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, variantId, lineId: res.lineId ?? null } : i,
          ),
        });
      }
    } catch (error) {
      console.error("Failed to add item to Shopify cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setQty = useCallback(async (id: string, qty: number) => {
    const current = readState();
    const item = current.items.find((i) => i.id === id);
    if (!item) return;

    if (qty <= 0) {
      writeState({ ...current, items: current.items.filter((i) => i.id !== id) });
      if (current.cartId && item.lineId) {
        setIsLoading(true);
        try {
          const res = await removeLineFromShopifyCart(current.cartId, item.lineId);
          if (res.cartNotFound) writeState({ ...readState(), cartId: null, checkoutUrl: null });
        } catch (e) {
          console.error("Failed to remove Shopify cart line:", e);
        } finally {
          setIsLoading(false);
        }
      }
      return;
    }

    writeState({ ...current, items: current.items.map((i) => (i.id === id ? { ...i, qty } : i)) });
    if (current.cartId && item.lineId) {
      setIsLoading(true);
      try {
        const res = await updateShopifyCartLine(current.cartId, item.lineId, qty);
        if (res.cartNotFound) writeState({ ...readState(), cartId: null, checkoutUrl: null });
      } catch (e) {
        console.error("Failed to update Shopify cart line:", e);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const removeItem = useCallback((id: string) => setQty(id, 0), [setQty]);

  const clear = useCallback(() => writeState(EMPTY), []);

  /** Clears the local cart once the Shopify cart has been checked out (empty). */
  const syncCart = useCallback(async () => {
    const current = readState();
    if (!current.cartId) return;
    try {
      const remaining = await getShopifyCartQuantity(current.cartId);
      if (remaining === 0) writeState(EMPTY);
    } catch (e) {
      console.error("Failed to sync cart with Shopify:", e);
    }
  }, []);

  const items = state.items;
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return {
    items,
    count,
    total,
    isLoading,
    checkoutUrl: state.checkoutUrl,
    addItem,
    removeItem,
    setQty,
    clear,
    syncCart,
  };
}
