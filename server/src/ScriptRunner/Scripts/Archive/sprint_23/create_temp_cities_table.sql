    CREATE TABLE public.cities_temp
    (
        id character varying COLLATE pg_catalog."default" NOT NULL,
        display_name character varying COLLATE pg_catalog."default",
        county_id integer,
        desk_id integer,
        desk_mapping_technique integer NOT NULL,
        CONSTRAINT cities_temp_pkey PRIMARY KEY (id),
        CONSTRAINT cities_temp_county_fk FOREIGN KEY (county_id)
            REFERENCES public.counties (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT cities_temp_desks_fk FOREIGN KEY (desk_id)
            REFERENCES public.desks (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT desk_mapping_technique_fk FOREIGN KEY (desk_mapping_technique)
            REFERENCES public.desks_mapping_technique (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
    )

    TABLESPACE pg_default;