-- DROP FUNCTION public.delete_investigation_reasons_id(integer, integer);

CREATE OR REPLACE FUNCTION public.delete_investigation_reasons_id(
	IN oldComplexityReasonId integer,
	IN epidemiology_number_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
	VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$	
BEGIN
UPDATE public.investigation
SET complexity_reasons_id = array_remove(complexity_reasons_id, oldComplexityReasonId)
WHERE epidemiology_number = epidemiology_number_input;
END;
$BODY$;
ALTER FUNCTION public.delete_investigation_reasons_id(integer, integer)
	OWNER TO coronai;