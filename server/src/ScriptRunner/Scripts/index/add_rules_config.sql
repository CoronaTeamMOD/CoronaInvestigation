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

INSERT INTO public.rules_config(key, value, description)
	VALUES ('settings_for_status_validity','{"from_age":70,"to_age":150,"from_age_and_vaccine":60,"to_age_and_vaccine":70,"vaccine_num":4,"status":"לא נחקר","sub_status":"פער בכ\"א","another_status":"לא נחקר","another_sub_status":"מדיניות משרד הבריאות"}'::json,'טבלת הגדרות לסטטוס לא נחקר')
	ON CONFLICT DO NOTHING;