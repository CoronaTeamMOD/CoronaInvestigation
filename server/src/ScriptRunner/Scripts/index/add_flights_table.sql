-- SEQUENCE: public.flight_id_seq

-- DROP SEQUENCE public.flight_id_seq;

CREATE SEQUENCE public.flight_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Table: public.flights

-- DROP TABLE public.flights;

CREATE TABLE IF NOT EXISTS public.flights
(
    id integer NOT NULL DEFAULT nextval('flight_id_seq'::regclass),
    exposure_id integer NOT NULL,
    flight_start_date timestamp with time zone,
	flight_end_date timestamp with time zone,
    flight_num character varying COLLATE pg_catalog."default",
	other_flight_num character varying(50) COLLATE pg_catalog."default",
	flight_seat_num character varying(10) COLLATE pg_catalog."default",
    airline_id character varying COLLATE pg_catalog."default",
	other_airline character varying(50) COLLATE pg_catalog."default",
	flight_origin_country character varying COLLATE pg_catalog."default",
    flight_origin_city character varying COLLATE pg_catalog."default",
    flight_origin_airport character varying COLLATE pg_catalog."default",
    flight_destination_country character varying COLLATE pg_catalog."default",
    flight_destination_city character varying COLLATE pg_catalog."default",
    flight_destination_airport character varying COLLATE pg_catalog."default",
    staying_place_id character varying COLLATE pg_catalog."default", 
	creation_source integer,
  
    CONSTRAINT flights_pkey PRIMARY KEY (id),
    CONSTRAINT flight_destination_country_fk FOREIGN KEY (flight_destination_country)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT flight_origin_country_fk FOREIGN KEY (flight_origin_country)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT exposure_id_fk FOREIGN KEY (exposure_id)
        REFERENCES public.exposure (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
	 CONSTRAINT creation_source_fk FOREIGN KEY (creation_source)
        REFERENCES public.creation_sources (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
	 CONSTRAINT airline_id_fk FOREIGN KEY (airline_id)
        REFERENCES public.airlines (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID  
)

TABLESPACE pg_default;


-- Index: flight_exposure_id_idx

-- DROP INDEX public.flight_exposure_id_idx;

CREATE INDEX IF NOT EXISTS flight_exposure_id_idx
    ON public.flights USING btree
    (exposure_id ASC NULLS LAST)
    TABLESPACE pg_default;

