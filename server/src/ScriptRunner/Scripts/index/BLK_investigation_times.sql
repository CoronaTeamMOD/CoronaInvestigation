CREATE TABLE IF NOT EXISTS public.investigation_times
(
    investigation_id integer NOT NULL,
    action_time timestamp with time zone,
	investigation_status integer NOT NULL,
	CONSTRAINT investigation_status_fk FOREIGN KEY (investigation_status)
        REFERENCES public.investigation_status (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION,
	CONSTRAINT investigation_id_fk FOREIGN KEY (investigation_id)
        REFERENCES public.investigation (epidemiology_number) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
);