ALTER TABLE public.contact_event
	ADD COLUMN IF NOT EXISTS externalization_approval_desc varchar;
	
ALTER TABLE public.investigation 
	ADD COLUMN IF NOT EXISTS isolation_source_desc varchar;

ALTER TABLE public.investigated_patient
	ADD COLUMN IF NOT EXISTS were_confirmed_exposures_desc varchar;