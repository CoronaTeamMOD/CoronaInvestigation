CREATE TABLE public.streets_temp
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    display_name character varying COLLATE pg_catalog."default",
    city character varying COLLATE pg_catalog."default",
    mho_code character varying COLLATE pg_catalog."default",
    desk_id integer,
    CONSTRAINT streets_pkey_temp PRIMARY KEY (id),
    CONSTRAINT city_fk FOREIGN KEY (city)
        REFERENCES public.cities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT streets_desks_fk FOREIGN KEY (desk_id)
        REFERENCES public.desks (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;