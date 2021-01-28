CREATE OR REPLACE FUNCTION public.deactivate_all_county_users(IN county_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE language character varying;
BEGIN

	UPDATE public."user"
	SET is_active = false
	WHERE investigation_group = county_id;

END;
$BODY$;