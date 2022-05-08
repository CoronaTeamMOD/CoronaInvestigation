-- FUNCTION: public.calc_investigation_complexity(integer)

-- DROP FUNCTION public.calc_investigation_complexity(integer);

CREATE OR REPLACE FUNCTION public.calc_investigation_complexity(
	epidemiology_number_value integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
	UPDATE public.investigation
	SET complexity_code= CASE WHEN EXISTS 
	 ( SELECT id
		FROM investigated_patient ip
	    WHERE ip.id = investigated_patient_id AND
	  		( ip.is_currently_hospitalized = true OR
			  ip.is_in_closed_institution = true OR
			  ip.occupation = 'מערכת החינוך' OR
			  ip.occupation = 'מערכת הבריאות' OR
			  ip.is_deceased = true OR
			  ip.hmo = 'אף אחד מהנ"ל' OR
			  Exists (SELECT epidemiology_number
						FROM covid_patients
						WHERE epidemiology_number = ip.covid_patient AND 
					 		( birth_date IS NULL AND
							   full_name IS NULL ))OR
							 (SELECT EXTRACT(YEAR FROM (AGE(birth_date)))
							  FROM covid_patients
							  WHERE epidemiology_number = ip.covid_patient) <= 14))
		THEN 1 ELSE 2 END
	WHERE epidemiology_number = epidemiology_number_value;
END;
$BODY$;

