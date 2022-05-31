ALTER TABLE public.investigation_complexity_reasons
ADD COLUMN IF NOT EXISTS status_validity boolean default false;

UPDATE public.investigation_complexity_reasons
SET status_validity = true
WHERE reason_id=12 or reason_id=13 or reason_id=7;