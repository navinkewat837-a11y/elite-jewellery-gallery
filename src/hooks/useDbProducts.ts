import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  gallery: string[];
  weight: string | null;
  metal: string | null;
  is_new: boolean;
  display_order: number;
  status: "draft" | "published";
  publish_at: string | null;
}

export function useDbProducts(options?: { preview?: boolean }) {
  const preview = !!options?.preview;
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    let query = supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    // In preview mode, admin RLS allows drafts through; otherwise restrict.
    if (!preview) query = query.eq("status", "published");
    const { data } = await query;
    setProducts((data as DbProduct[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  return { products, loading, refetch };
}