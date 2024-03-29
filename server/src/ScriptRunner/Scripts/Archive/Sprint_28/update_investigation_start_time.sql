-- FUNCTION: public.update_investigation_start_time(timestamp without time zone, integer)

-- DROP FUNCTION public.update_investigation_start_time(timestamp without time zone, integer);

CREATE OR REPLACE FUNCTION public.update_investigation_start_time(
	time_input timestamp without time zone,
	investigation_id_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
--Update start time of investigation

begin 

	UPDATE public.investigation
	SET start_time=time_input
	WHERE epidemiology_number = investigation_id_input
	and start_time is null;

	INSERT INTO public.investigation_times(
	investigation_id, action_time, investigation_status)
	VALUES (investigation_id_input, time_input, 100000002);

end;
$BODY$;

