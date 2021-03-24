-- OR EXTRACT(YEAR from AGE(ip.birth_date)) <= 14) - this line took too much time and created duplecated values in test mabar

UPDATE public.investigation
SET complexity_reasons_id = 
	CASE WHEN epidemiology_number IN ( SELECT epidemiology_number
			 FROM covid_patients ip
			 WHERE ip.age <= 14
			 OR EXTRACT(YEAR from AGE(ip.birth_date)) <= 14)
			 AND investigation_status != 100000001
			 AND complexity_code = 1
			 THEN array_append(complexity_reasons_id, 3)
		 ELSE complexity_reasons_id
END


-- OR ip.birth_date > CAST('2021-03-21' AS DATE) - CAST('14 years' AS INTERVAL)) - this line took too much time and created duplecated values in test mabar

UPDATE public.investigation
SET complexity_reasons_id =
    CASE WHEN epidemiology_number IN ( SELECT epidemiology_number
            FROM covid_patients ip
            WHERE ip.age <= 14
            OR ip.birth_date > CAST('2021-03-21' AS DATE) - CAST('14 years' AS INTERVAL))
            AND investigation_status != 100000001
            AND complexity_code = 1
            THEN array_append(complexity_reasons_id, 3)
        ELSE complexity_reasons_id
END

-- create age for investigations that have birth_date - works in less then a minute

UPDATE public.covid_patients
SET age = EXTRACT(YEAR FROM (AGE(birth_date)))
WHERE age is null;


--- sctipt that worked last upload - and updates the complexiy reasons according to field age
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
