-- FUNCTION: public.save_clinical_details(json)

-- DROP FUNCTION public.save_clinical_details(json);

CREATE OR REPLACE FUNCTION public.save_clinical_details(
	clinical_details json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--Save clinical details of investigation Variables:
hospitalInput varchar;
hospitalizationEndTimeInput timestamp;
hospitalizationStartTimeInput timestamp;
isIsolationProblemInput bool;
isIsolationProblemMoreInfoInput varchar;
isolationEndTimeInput timestamp;
isolationStartTimeInput timestamp;
isolationSourceInput int4;
isolationSourceDescInput varchar;
symptomsStartTimeInput timestamp;
isolationAddressInput int4;
isInIsolationInput bool;
doesHaveSymptomsInput bool;
wasHospitalizedInput bool;
otherSymptomsMoreInfoInput varchar;
epidemiologyNumberInput int4;

--Save background Diseases Variables:
investigatedPatientIdInput int4;
backgroundDiseasesInput json;
areBackgroundDiseaseEmpty bool;
backgroundDiseasesArray varchar[];
backgroundDisease varchar;

--Save Symptoms Variables:
symptomNamesInput json;
areSymptomsEmpty bool;
symptomNamesArray varchar[];
symptomName varchar;

--Save investigated patient clinical details Variables:
isPregnantInput bool;
doesHaveBackgroundDiseasesInput bool;
otherBackgroundDiseasesMoreInfoInput varchar;
wasInstructedToBeInIsolationInput bool;

begin 
	
    select trim(nullif((clinical_details->'hospital')::text,'null'),'"') into hospitalInput;
    select nullif((clinical_details->'hospitalizationEndDate')::text,'null')::timestamp into hospitalizationEndTimeInput;
    select nullif((clinical_details->'hospitalizationStartDate')::text,'null')::timestamp into hospitalizationStartTimeInput;
    select nullif((clinical_details->'isIsolationProblem')::text,'null')::bool into isIsolationProblemInput;
    select trim(nullif((clinical_details->'isIsolationProblemMoreInfo')::text,'null'),'"') into isIsolationProblemMoreInfoInput;
    select nullif((clinical_details->'isolationEndDate')::text,'null')::timestamp into isolationEndTimeInput;
    select nullif((clinical_details->'isolationStartDate')::text,'null')::timestamp into isolationStartTimeInput;
    select trim(nullif((clinical_details->'isolationSource')::text,'null'),'"')::int4 into isolationSourceInput;  
    select trim(nullif((clinical_details->'isolationSourceDesc')::text,'null'),'"') into isolationSourceDescInput;
    select nullif((clinical_details->'symptomsStartDate')::text,'null')::timestamp into symptomsStartTimeInput;
    select trim(nullif((clinical_details->'isolationAddressId')::text,'null'),'"')::int4 into isolationAddressInput;  
    select nullif((clinical_details->'isInIsolation')::text,'null')::bool into isInIsolationInput;
    select nullif((clinical_details->'doesHaveSymptoms')::text,'null')::bool into doesHaveSymptomsInput;
    select nullif((clinical_details->'wasHospitalized')::text,'null')::bool into wasHospitalizedInput;
    select trim(nullif((clinical_details->'otherSymptomsMoreInfo')::text,'null'),'"') into otherSymptomsMoreInfoInput;
    select trim(nullif((clinical_details->'epidemiologyNumber')::text,'null'),'"')::int4 into epidemiologyNumberInput;

    select trim(nullif((clinical_details->'investigatedPatientId')::text,'null'),'"')::int4 into investigatedPatientIdInput;
    select (clinical_details->'backgroundDeseases') into backgroundDiseasesInput;
    areBackgroundDiseaseEmpty := backgroundDiseasesInput::TEXT = '[]';
    backgroundDiseasesArray:=(select array_agg(b_data.value) from json_array_elements_text(backgroundDiseasesInput) b_data);

    select (clinical_details->'symptoms') into symptomNamesInput;
    areSymptomsEmpty := symptomNamesInput::TEXT = '[]';
    symptomNamesArray:=(select array_agg(s_data.value) from json_array_elements_text(symptomNamesInput) s_data);

    select nullif((clinical_details->'isPregnant')::text,'null')::bool into isPregnantInput;
    select nullif((clinical_details->'doesHaveBackgroundDiseases')::text,'null')::bool into doesHaveBackgroundDiseasesInput;
    select trim(nullif((clinical_details->'otherBackgroundDiseasesMoreInfo')::text,'null'),'"') into otherBackgroundDiseasesMoreInfoInput;
	select nullif((clinical_details->'wasInstructedToBeInIsolation')::text,'null')::bool into wasInstructedToBeInIsolationInput;

	UPDATE public.investigation
	SET 
        isolation_address=isolationAddressInput, 
        is_in_isolation=isInIsolationInput, 
        is_isolation_problem=isIsolationProblemInput, 
        isolation_start_time=isolationStartTimeInput, 
        symptoms_start_time=symptomsStartTimeInput, 
        hospital=hospitalInput, 
        hospitalization_start_time=hospitalizationStartTimeInput, 
        hospitalization_end_time=hospitalizationEndTimeInput, 
        is_isolation_problem_more_info=isIsolationProblemMoreInfoInput, 
        isolation_end_time=isolationEndTimeInput, 
        does_have_symptoms=doesHaveSymptomsInput, 
        was_hospitalized=wasHospitalizedInput, 
        isolation_source=isolationSourceInput, 
        other_symptoms_more_info=otherSymptomsMoreInfoInput,
        isolation_source_desc=isolationSourceDescInput
	WHERE epidemiology_number = epidemiologyNumberInput;

	DELETE FROM investigated_patient_background_diseases where investigated_patient_id = investigatedPatientIdInput;
	if backgroundDiseasesArray is not null and areBackgroundDiseaseEmpty = false then
        foreach backgroundDisease in array backgroundDiseasesArray 
        loop
        INSERT INTO public.investigated_patient_background_diseases(
            investigated_patient_id, background_deseas_name)
        VALUES (investigatedPatientIdInput, backgroundDisease)
        ON CONFLICT DO NOTHING;
        end loop;
    end if;
	
	DELETE FROM investigated_patient_symptoms where investigation_id = epidemiologyNumberInput;
	if symptomNamesArray is not null and areSymptomsEmpty = false then
        foreach symptomName in array symptomNamesArray 
        loop
        INSERT INTO public.investigated_patient_symptoms(
            investigation_id, symptom_name)
        VALUES (epidemiologyNumberInput, symptomName)
        ON CONFLICT DO NOTHING;
        end loop;
    end if;

    UPDATE public.investigated_patient
	    SET 
            is_pregnant=isPregnantInput,
            does_have_background_diseases=doesHaveBackgroundDiseasesInput,
            other_background_diseases_more_info=otherBackgroundDiseasesMoreInfoInput,
			was_instructed_to_be_in_isolation = wasInstructedToBeInIsolationInput
	WHERE id = investigatedPatientIdInput;

end;
$BODY$;
