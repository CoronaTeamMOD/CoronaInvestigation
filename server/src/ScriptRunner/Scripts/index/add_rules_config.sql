-- Creating table rules_config

CREATE TABLE IF NOT EXISTS public.rules_config
(
    key character varying COLLATE pg_catalog."default" NOT NULL,
    value json,
    description character varying COLLATE pg_catalog."default",
    CONSTRAINT rules_config_pkey PRIMARY KEY (key)
)

TABLESPACE pg_default;

-- Inserting data into table rules_config

INSERT INTO public.rules_config(key, value, description)
	VALUES ('ifContactsNeedIsolation','{"ifContactsNeedIsolation":false}'::json,'האם מגעים מחוייבים בבידוד')
	ON CONFLICT DO NOTHING;

