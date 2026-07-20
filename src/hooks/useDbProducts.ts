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
}

export function useDbProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    setProducts((data as DbProduct[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { products, loading, refetch };
}