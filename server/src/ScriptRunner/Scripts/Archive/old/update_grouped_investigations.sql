-- FUNCTION: public.update_grouped_investigations(integer[], uuid)

-- DROP FUNCTION public.update_grouped_investigations(integer[], uuid);

CREATE OR REPLACE FUNCTION public.update_grouped_investigations(
	epidemiology_numbers integer[],
	val uuid)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
BEGIN

	UPDATE public.investigation
	SET group_id = val
	WHERE epidemiology_number IN ( select unnest(epidemiology_numbers));
END;
$BODY$;

ALTER FUNCTION public.update_grouped_investigations(integer[], uuid)
    OWNER TO coronai;

