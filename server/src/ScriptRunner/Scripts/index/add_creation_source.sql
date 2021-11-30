-- Creating table investigation_creation_source

CREATE TABLE IF NOT EXISTS public.investigation_creation_source
(
    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT contact_creation_source_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

-- Inserting data into table investigation_creation_source

INSERT INTO public.investigation_creation_source(id, display_name)
	VALUES (1,'חקירה אנושית')
	ON CONFLICT DO NOTHING;

INSERT INTO public.investigation_creation_source(id, display_name)
	VALUES (2,'חקירת בוט')
	ON CONFLICT DO NOTHING;

--Adding column creation_source to contact event table

ALTER TABLE contact_event
ADD COLUMN IF NOT EXISTS creation_source integer;

ALTER TABLE contact_event DROP CONSTRAINT IF EXISTS ce_creation_source_fk;

ALTER TABLE contact_event ADD CONSTRAINT ce_creation_source_fk 
FOREIGN KEY (creation_source)
REFERENCES public.investigation_creation_source (id) MATCH SIMPLE;

--Adding column creation_source to contacted person table

ALTER TABLE contacted_person
ADD COLUMN IF NOT EXISTS creation_source integer;

ALTER TABLE contacted_person DROP CONSTRAINT IF EXISTS cp_creation_source_fk;

ALTER TABLE contacted_person ADD CONSTRAINT cp_creation_source_fk 
FOREIGN KEY (creation_source)
REFERENCES public.investigation_creation_source (id) MATCH SIMPLE;
