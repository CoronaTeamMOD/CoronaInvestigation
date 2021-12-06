ALTER TABLE investigation
ADD COLUMN IF NOT EXISTS last_updator_user character varying COLLATE pg_catalog."default";

ALTER TABLE public.investigation DROP CONSTRAINT IF EXISTS last_updator_user_fk;

ALTER TABLE public.investigation ADD CONSTRAINT last_updator_user_fk 
FOREIGN KEY (last_updator_user)
REFERENCES public."user" (id) MATCH SIMPLE;