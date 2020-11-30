-- FUNCTION: public.create_grouped_investigations(uuid, integer, character varying, integer[])

-- DROP FUNCTION public.create_grouped_investigations(uuid, integer, character varying, integer[]);

CREATE OR REPLACE FUNCTION public.create_grouped_investigations(
	id uuid,
	reason integer,
	other_reason character varying,
	epidemiology_numbers integer[])
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE language character varying;
BEGIN

	INSERT INTO public."investigation_group"
	(id, reason, other_reason)
	VALUES (id, reason, other_reason);
	
	PERFORM update_grouped_investigations(epidemiology_numbers, id);
	
END;
$BODY$;

ALTER FUNCTION public.create_grouped_investigations(uuid, integer, character varying, integer[])
    OWNER TO coronai;
