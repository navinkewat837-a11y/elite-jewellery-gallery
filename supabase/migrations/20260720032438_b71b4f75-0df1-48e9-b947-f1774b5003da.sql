
ALTER TABLE public.products
  ADD COLUMN status text NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'published'));

-- Keep existing catalog live.
UPDATE public.products SET status = 'published';

CREATE INDEX products_status_idx ON public.products (status);

-- Restrict the public read policy to published rows only.
DROP POLICY IF EXISTS "Products are public readable" ON public.products;
CREATE POLICY "Published products are public readable"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Admins can read every product (drafts included) in the admin panel.
CREATE POLICY "Admins can read all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
