UPDATE public.investigation
SET complexity_reasons_id = 
	CASE WHEN epidemiology_number IN ( SELECT epidemiology_number
            FROM covid_patients ip
            WHERE ip.age <= 14)
            AND investigation_status != 100000001
            AND complexity_code = 1
            THEN array_append(complexity_reasons_id, 3)
        ELSE complexity_reasons_id
END