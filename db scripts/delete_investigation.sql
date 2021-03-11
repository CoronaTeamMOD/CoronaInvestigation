CREATE OR REPLACE FUNCTION public.delete_investigation(IN delete_epi_number integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
declare
	investigations_in_group int4;
	group_id_to_inspect uuid;
begin
	
	DELETE FROM public.investigated_patient_symptoms 
		where investigation_id = delete_epi_number;
	
	DELETE FROM public.exposure 
		where investigation_id = delete_epi_number;
	
	DELETE FROM public.contacted_person  
		where contact_event	in (select id from public.contact_event where investigation_id = delete_epi_number);
		
	DELETE FROM public.investigated_patient_background_diseases
		WHERE investigated_patient_id in (select id from public.investigated_patient where covid_patient = delete_epi_number);
	
	DELETE FROM public.investigation_settings
		WHERE epidemiology_number = delete_epi_number;
	
	DELETE FROM public.involved_contact
		WHERE investigation_id = delete_epi_number;
	
	DELETE FROM public.contact_event
		where investigation_id = delete_epi_number;
		
	-- deleting persons from involved contacts
	DELETE FROM public.person
		WHERE id in (select person_id from public.involved_contact where investigation_id = delete_epi_number);
		
	-- deleting persons that are related to contact_event
	DELETE FROM public.person
		where id in (select person_info from public.contacted_person where contact_event in (select id from public.contact_event where investigation_id = delete_epi_number));
		
	SELECT INTO group_id_to_inspect
	group_id
	FROM investigation
	WHERE epidemiology_number = delete_epi_number;
		
	DELETE FROM public.investigation
		WHERE epidemiology_number = delete_epi_number;
		
	DELETE FROM public.investigated_patient
		where covid_patient = delete_epi_number;
		
	SELECT INTO investigations_in_group
	COUNT(*)
	FROM investigation
	WHERE group_id = group_id_to_inspect;

	-- if in the future the minimum for group will be increased
	IF investigations_in_group < 2 THEN
		-- in order to avoid unnecessary scan 
		IF investigations_in_group > 0 THEN
			UPDATE investigation
			SET group_id = null
			WHERE group_id = group_id_to_inspect;
		END IF;
		DELETE FROM public.investigation_group 
		WHERE id = group_id_to_inspect;
	END IF;

end;
$BODY$;
