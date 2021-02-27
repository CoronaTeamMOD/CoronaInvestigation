DROP FUNCTION public.update_investigation_reasons_id(integer, integer);

CREATE OR REPLACE FUNCTION public.update_investigation_reasons_id(
	new_complexity_reason_id integer,
	epidemiology_number_input integer)
		RETURNS void
 		LANGUAGE plpgsql
	AS $BODY$	
declare
BEGIN
UPDATE public.investigation
SET complexity_reasons_id = complexity_reasons_id || new_complexity_reason_id
WHERE epidemiology_number = epidemiology_number_input
AND NOT (new_complexity_reason_id = ANY (complexity_reasons_id));	
END;
$BODY$;
ALTER FUNCTION public.update_investigation_reasons_id(integer, integer)
    OWNER TO coronai;
 