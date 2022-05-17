-- Creating table vaccine_dose

CREATE TABLE IF NOT EXISTS public.vaccine_dose
(
    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT vaccine_dose_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

-- Inserting data into table vaccine_dose

INSERT INTO public.vaccine_dose(id, display_name)
	VALUES (0,'ללא חיסון בתוקף')
	ON CONFLICT DO NOTHING;

INSERT INTO public.vaccine_dose(id, display_name)
	VALUES (1,'לא ידוע מספר מנה')
	ON CONFLICT DO NOTHING;

INSERT INTO public.vaccine_dose(id, display_name)
	VALUES (2,'מנה שניה')
	ON CONFLICT DO NOTHING;
	
INSERT INTO public.vaccine_dose(id, display_name)
	VALUES (3,'מנה שלישית')
	ON CONFLICT DO NOTHING;
	
INSERT INTO public.vaccine_dose(id, display_name)
	VALUES (4,'מנה רביעית')
	ON CONFLICT DO NOTHING;

-- add vaccine_dose_id column to investigation table
ALTER TABLE investigation
ADD COLUMN IF NOT EXISTS vaccine_dose_id integer;

ALTER TABLE investigation ADD CONSTRAINT investigation_vaccine_dose_fk 
FOREIGN KEY (vaccine_dose_id)
REFERENCES public.vaccine_dose (id) MATCH SIMPLE;

-- drop not null constrain and default of is_vaccinated column
alter table investigation alter column is_vaccinated drop not null;
alter table investigation alter column is_vaccinated drop default;