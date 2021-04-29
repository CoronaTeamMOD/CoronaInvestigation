-- FUNCTION: public.update_static_info(character varying, character varying, character varying, integer)

DROP FUNCTION IF EXISTS public.update_static_info(character varying, character varying, character varying, integer);

CREATE OR REPLACE FUNCTION public.update_static_info(
	full_name_input character varying,
	identification_type_input integer,
	identity_number_input character varying,
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

	elsif status = 100000001 then
		UPDATE public.investigation
		SET end_time=(SELECT now())
		WHERE epidemiology_number = epidemiology_number_input;
	end if;

end;
$BODY$;