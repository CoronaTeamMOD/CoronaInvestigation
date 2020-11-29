-- FUNCTION: public.create_group_for_investigations(uuid, integer, character varying)

-- DROP FUNCTION public.create_group_for_investigations(uuid, integer, character varying);

CREATE OR REPLACE FUNCTION public.create_group_for_investigations(
	id uuid,
	reason integer,
	other_reason character varying)
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
	
END;
$BODY$;

ALTER FUNCTION public.create_group_for_investigations(uuid, integer, character varying)
    OWNER TO coronai;
