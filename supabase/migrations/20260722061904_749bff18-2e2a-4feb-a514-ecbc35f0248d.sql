CREATE TABLE public.preview_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.preview_tokens TO authenticated;
GRANT ALL ON public.preview_tokens TO service_role;

ALTER TABLE public.preview_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage preview tokens"
ON public.preview_tokens FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.is_preview_token_valid(_token text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.preview_tokens
    WHERE token = _token
      AND NOT revoked
      AND expires_at > now()
  );
$$;

CREATE OR REPLACE FUNCTION public.get_preview_products(_token text)
RETURNS SETOF public.products
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.* FROM public.products p
  WHERE public.is_preview_token_valid(_token)
  ORDER BY p.display_order ASC, p.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_preview_categories(_token text)
RETURNS SETOF public.categories
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.* FROM public.categories c
  WHERE public.is_preview_token_valid(_token) AND c.visible = true
  ORDER BY c.display_order ASC;
$$;

GRANT EXECUTE ON FUNCTION public.is_preview_token_valid(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_preview_products(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_preview_categories(text) TO anon, authenticated;