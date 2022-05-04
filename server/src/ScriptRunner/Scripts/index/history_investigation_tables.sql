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


CREATE SEQUENCE IF NOT EXISTS public.investigation_history_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;


CREATE TABLE IF NOT EXISTS public.investigation_history
(
    investigation_history_id  integer NOT NULL DEFAULT nextval('investigation_history_seq'::regclass),
    epidemiology_number integer not null,
    change_date timestamp with time zone NOT NULL,
    changed_by character varying COLLATE pg_catalog."default" ,
    action_type_id integer,
    changed_field character varying COLLATE pg_catalog."default",
    old_value character varying COLLATE pg_catalog."default",
    new_value character varying COLLATE pg_catalog."default",

    CONSTRAINT investigation_history_pkey PRIMARY KEY (investigation_history_id),
    CONSTRAINT epidemiology_number_fkey FOREIGN KEY (epidemiology_number)
        REFERENCES public.investigation (epidemiology_number) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
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


--- investigation table trigger

CREATE OR REPLACE FUNCTION public.update_history_investigation()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
  		IF (TG_OP = 'INSERT') THEN          
			 INSERT INTO public.investigation_history(change_date, changed_by, action_type_id, epidemiology_number, changed_field, old_value, new_value)
			 VALUES (now(), NEW.last_updator_user , 1, NEW.epidemiology_number, null, null, null);
			 RETURN NEW;
        ELSEIF (TG_OP = 'UPDATE') THEN
			   IF (NEW.investigation_status <> OLD.investigation_status) THEN
				 INSERT INTO public.investigation_history(change_date, changed_by, action_type_id,epidemiology_number, changed_field, old_value, new_value)
				 VALUES (now(), NEW.last_updator_user ,2, NEW.epidemiology_number, 'investigation_status',  OLD.investigation_status,  NEW.investigation_status);
			  ELSEIF (NEW.creator <> OLD.creator) THEN
				 INSERT INTO public.investigation_history(change_date, changed_by, action_type_id,epidemiology_number, changed_field, old_value, new_value)
				 VALUES (now(), NEW.last_updator_user ,2, NEW.epidemiology_number, 'creator',  OLD.creator,  NEW.creator);
			  ELSEIF (NEW.last_updator_user <> OLD.last_updator_user OR
					  (OLD.last_updator_user is null AND NEW.last_updator_user is not null) OR
					  NEW.last_update_time::Date <> OLD.last_update_time::Date) THEN
				 INSERT INTO public.investigation_history(change_date, changed_by, action_type_id,epidemiology_number, changed_field, old_value, new_value)
				 VALUES (now(), NEW.last_updator_user, 2, NEW.epidemiology_number, null, null, null);
			  END IF;
			 RETURN NEW;
        END IF;
    END;
$BODY$;



DO $$
BEGIN
  IF NOT EXISTS(SELECT *
    FROM information_schema.triggers
    WHERE event_object_table = 'investigation'
    AND trigger_name = 'investigation_change_trigger'
  )
  THEN
    CREATE TRIGGER  investigation_change_trigger
	AFTER INSERT OR UPDATE ON public.investigation
    FOR EACH ROW EXECUTE PROCEDURE update_history_investigation();
  END IF;
END;
$$

