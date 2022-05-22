ALTER TABLE public.exposure
ALTER COLUMN was_confirmed_exposure
DROP NOT NULL;

ALTER TABLE public.exposure
ADD COLUMN IF NOT EXISTS was_in_vacation boolean;

ALTER TABLE public.exposure
ADD COLUMN IF NOT EXISTS was_in_event boolean;

ALTER TABLE public.exposure
ADD COLUMN IF NOT EXISTS last_destination_leaving_date timestamp with time zone;

ALTER TABLE public.exposure
ADD COLUMN IF NOT EXISTS creation_source int;

ALTER TABLE public.exposure
ADD COLUMN IF NOT EXISTS were_confirmed_exposures_desc character varying COLLATE pg_catalog."default";


ALTER TABLE public.exposure DROP CONSTRAINT IF EXISTS creation_source_fk;

ALTER TABLE public.exposure
ADD CONSTRAINT  creation_source_fk FOREIGN KEY (creation_source)
        REFERENCES public.creation_sources (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID;