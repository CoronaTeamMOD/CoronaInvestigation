---Add new value in creation sources table - for bot
INSERT INTO public.creation_sources(id, display_name) VALUES (9, 'חקירת בוט') ON CONFLICT DO NOTHING;

--Adding column creation_source to contact event table

ALTER TABLE contact_event
ADD COLUMN IF NOT EXISTS creation_source integer;

ALTER TABLE contact_event DROP CONSTRAINT IF EXISTS ce_creation_source_fk;

ALTER TABLE contact_event ADD CONSTRAINT ce_creation_source_fk 
FOREIGN KEY (creation_source)
REFERENCES public.creation_sources (id) MATCH SIMPLE;

--Adding column creation_source to contacted person table

ALTER TABLE contacted_person
ADD COLUMN IF NOT EXISTS creation_source integer;

ALTER TABLE contacted_person DROP CONSTRAINT IF EXISTS cp_creation_source_fk;

ALTER TABLE contacted_person ADD CONSTRAINT cp_creation_source_fk 
FOREIGN KEY (creation_source)
REFERENCES public.creation_sources (id) MATCH SIMPLE;