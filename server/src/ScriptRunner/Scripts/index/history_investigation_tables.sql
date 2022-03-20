-- Creating table action_type

CREATE TABLE IF NOT EXISTS public.action_type
(
    id integer NOT NULL,
    display_name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT action_type_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

-- Inserting data into table action_type

INSERT INTO public.action_type(id, display_name)
	VALUES (1,'יצירה')
	ON CONFLICT DO NOTHING;

INSERT INTO public.action_type(id, display_name)
	VALUES (2,'עדכון')
	ON CONFLICT DO NOTHING;

-- Creating table investigation_history

CREATE TABLE IF NOT EXISTS public.investigation_history
(
    investigation_history_id  integer NOT NULL,
    change_date timestamp with time zone NOT NULL,
    changed_by character varying COLLATE pg_catalog."default" NOT NULL,
    action_type_id integer,
    changed_field character varying COLLATE pg_catalog."default",
    old_value character varying COLLATE pg_catalog."default",
    new_value character varying COLLATE pg_catalog."default",

    CONSTRAINT investigation_history_pkey PRIMARY KEY (investigation_history_id),
    CONSTRAINT changed_by_user_fkey FOREIGN KEY (changed_by)
        REFERENCES public.user (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT action_type_id_fkey FOREIGN KEY (action_type_id)
        REFERENCES public.action_type (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;