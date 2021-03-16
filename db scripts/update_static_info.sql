-- FUNCTION: public.update_static_info(varchar, varchar, varchar, integer)

-- DROP FUNCTION public.update_static_info(varchar, varchar, varchar, integer);

CREATE OR REPLACE FUNCTION public.update_static_info(
	full_name_input varchar,
	identification_type_input varchar,
	identity_number_input varchar,
	epidemiology_number_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--Update static info of investigation
status integer;

begin 
	SELECT investigation_status INTO status FROM public.investigation
		WHERE epidemiology_number = epidemiology_number_input;
	
	UPDATE public.covid_patients
	SET identity_number=COALESCE(identity_number_input, identity_number), full_name=COALESCE(full_name_input, full_name)
	WHERE epidemiology_number = epidemiology_number_input;

	UPDATE public.investigated_patient
	SET identity_type=COALESCE(identification_type_input, identity_type)
	WHERE covid_patient = epidemiology_number_input;

	if status = 100000000 then
		UPDATE public.investigation
		SET last_update_time=(SELECT now())
		WHERE epidemiology_number = epidemiology_number_input;
	end if;

	if status = 100000001 then
		UPDATE public.investigation
		SET end_time=(SELECT now())
		WHERE epidemiology_number = epidemiology_number_input;
	end if;

end;
$BODY$;

ALTER FUNCTION public.update_static_info(varchar, varchar, varchar, integer)
    OWNER TO coronai;

COMMENT ON FUNCTION public.update_static_info(varchar, varchar, varchar, integer)
    IS 'Update static info of investigation';