-- FUNCTION: public.update_investigation_end_time(timestamp, integer)

-- DROP FUNCTION IF EXISTS public.update_investigation_end_time(timestamp, integer);

CREATE OR REPLACE FUNCTION public.update_investigation_end_time(
	time_input timestamp,
	investigation_id_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
--Update end time of investigation

begin 

	UPDATE public.investigation
	SET end_time=time_input
	WHERE epidemiology_number = investigation_id_input;

	INSERT INTO public.investigation_times(
	investigation_id, action_time, investigation_status)
	VALUES (investigation_id_input, time_input, 100000001);

end;
$BODY$;