-- FUNCTION: public.update_investigation_reasons_id(integer, integer)

-- DROP FUNCTION IF EXISTS public.update_investigation_reasons_id(integer, integer);

CREATE OR REPLACE FUNCTION public.update_investigation_reasons_id(
	new_complexity_reason_id integer,
	epidemiology_number_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
BEGIN
UPDATE public.investigation
SET complexity_reasons_id = array_append(complexity_reasons_id, new_complexity_reason_id), 
	complexity_code = 1
WHERE epidemiology_number = epidemiology_number_input;
END;
$BODY$;