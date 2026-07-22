import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "eligallery.previewMode";

function readFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("preview");
    if (q === "1" || q === "true") {
      sessionStorage.setItem(KEY, "1");
      return true;
    }
    if (q === "0" || q === "false") {
      sessionStorage.removeItem(KEY);
      return false;
    }
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Admin-only preview: when enabled AND the signed-in user has the admin role,
 * consumers may fetch draft rows in addition to published ones. Persisted in
 * sessionStorage so it survives client-side navigation but not a new tab.
 */
export function usePreviewMode() {
  const [requested, setRequested] = useState<boolean>(() => readFlag());
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id;
      if (!uid) {
        if (mounted) {
          setIsAdmin(false);
          setChecked(true);
        }
        return;
      }
      const { data: row } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        setIsAdmin(!!row);
        setChecked(true);
      }
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const enabled = requested && isAdmin;

  function setPreview(next: boolean) {
    if (typeof window !== "undefined") {
      if (next) sessionStorage.setItem(KEY, "1");
      else sessionStorage.removeItem(KEY);
    }
    setRequested(next);
  }

  return { enabled, requested, isAdmin, checked, setPreview };
}