import { useEffect, useState, useCallback } from "react";
import { loadSupabase } from "@/lib/supabase-lazy";

export interface DbCategory {
  id: string;
  name: string;
  display_order: number;
  visible: boolean;
}

export function useDbCategories(opts: { onlyVisible?: boolean } = {}) {
  const { onlyVisible = false } = opts;
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    const supabase = await loadSupabase();
    let query = supabase
      .from("categories")
      .select("id,name,display_order,visible")
      .order("display_order", { ascending: true });
    if (onlyVisible) query = query.eq("visible", true);
    const { data } = await query;
    setCategories((data as DbCategory[]) ?? []);
    setLoading(false);
  }, [onlyVisible]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { categories, loading, refetch };
}
