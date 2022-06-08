select epidemiology_number FROM public.investigation
WHERE xrm_status_id <> 1
AND xrm_response_time > '2022-05-17 05:00:00'
AND xrm_response_time < '2022-05-18 05:00:00'
ORDER BY epidemiology_number DESC