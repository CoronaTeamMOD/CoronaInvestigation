-- SEQUENCE: public.exposure_details_id_seq

-- DROP SEQUENCE public.exposure_details_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.exposure_details_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Table: public.exposure_details

-- DROP TABLE public.exposure_details;

CREATE TABLE IF NOT EXISTS public.exposure_details
(
    id integer NOT NULL DEFAULT nextval('exposure_details_id_seq'::regclass),
    exposure_id integer NOT NULL,
    exposure_place_name character varying COLLATE pg_catalog."default",
    exposure_place_type character varying COLLATE pg_catalog."default",
    exposure_date timestamp with time zone NOT NULL,
    exposure_address character varying COLLATE pg_catalog."default",
    exposure_place_sub_type integer, 
    exposure_source integer,
    is_exposure_person_known boolean,
	other_exposure_source character varying COLLATE pg_catalog."default",
	xrm_exposure_source character varying COLLATE pg_catalog."default",
	exposure_comment character varying COLLATE pg_catalog."default",
	creation_source integer,
	
    CONSTRAINT exposure_details_pkey PRIMARY KEY (id),
    CONSTRAINT exposure_id_fk FOREIGN KEY (exposure_id)
        REFERENCES public.exposure (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
	CONSTRAINT exposure_source_fk FOREIGN KEY (exposure_source)
        REFERENCES public.covid_patients (epidemiology_number) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT place_sub_type_fk FOREIGN KEY (exposure_place_sub_type)
        REFERENCES public.place_sub_types (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT place_type_fk FOREIGN KEY (exposure_place_type)
        REFERENCES public.place_types (display_name) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
	 CONSTRAINT creation_source_fk FOREIGN KEY (creation_source)
        REFERENCES public.creation_sources (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE pg_default;


-- Index: exposure_id_idx

-- DROP INDEX public.exposure_id_idx;

CREATE INDEX IF NOT EXISTS exposure_id_idx
    ON public.exposure_details USING btree
    (exposure_id ASC NULLS LAST)
    TABLESPACE pg_default;

