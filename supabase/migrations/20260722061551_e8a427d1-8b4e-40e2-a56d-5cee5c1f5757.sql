ALTER TABLE public.products ADD COLUMN IF NOT EXISTS publish_at timestamptz;
CREATE INDEX IF NOT EXISTS products_publish_at_idx ON public.products (publish_at) WHERE status = 'draft' AND publish_at IS NOT NULL;

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.run_scheduled_product_publishes()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.products
     SET status = 'published',
         publish_at = NULL,
         updated_at = now()
   WHERE status = 'draft'
     AND publish_at IS NOT NULL
     AND publish_at <= now();
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

REVOKE ALL ON FUNCTION public.run_scheduled_product_publishes() FROM PUBLIC, anon, authenticated;

DO $$
DECLARE
  existing_jobid bigint;
BEGIN
  SELECT jobid INTO existing_jobid FROM cron.job WHERE jobname = 'publish-scheduled-products';
  IF existing_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(existing_jobid);
  END IF;
  PERFORM cron.schedule(
    'publish-scheduled-products',
    '* * * * *',
    $cron$SELECT public.run_scheduled_product_publishes();$cron$
  );
END $$;