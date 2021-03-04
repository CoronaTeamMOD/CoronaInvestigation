-- DROP FUNCTION public.update_investigation_reasons_id(integer, integer);

CREATE OR REPLACE FUNCTION public.update_investigation_reasons_id(
	IN new_complexity_reason_id integer,
	IN epidemiology_number_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
	VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$	
declare
BEGIN
UPDATE public.investigation
SET complexity_reasons_id = array_append(complexity_reasons_id, new_complexity_reason_id)
WHERE epidemiology_number = epidemiology_number_input;
END;
$BODY$;
ALTER FUNCTION public.update_investigation_reasons_id(integer, integer)
	OWNER TO coronai;