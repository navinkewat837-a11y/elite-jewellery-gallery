/**
 * Lazily loads the Supabase client so it is split out of the homepage bundle
 * and only fetched after hydration when data is actually needed.
 */
type Client = typeof import("@/integrations/supabase/client")["supabase"];

let promise: Promise<Client> | null = null;

export function loadSupabase(): Promise<Client> {
  if (!promise) {
    promise = import("@/integrations/supabase/client").then((m) => m.supabase);
  }
  return promise;
}
