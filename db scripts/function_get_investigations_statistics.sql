-- FUNCTION: public.function_get_investigation_statistics(integer, integer[], date, date)

-- DROP FUNCTION public.function_get_investigation_statistics(integer, integer[], date, date);

CREATE OR REPLACE FUNCTION public.function_get_investigation_statistics(
	county_input integer,
	desks_input integer[],
	start_date_input date,
	end_date_input date)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
-- Dealaring all of the statistics variables
declare 
statistics_json json;
allInvestigationsCount bigint;
inProcessCount bigint;
newInvestigationsCount bigint;
unassignedInvestigationsCount bigint;
inactiveInvestigationsCount bigint;
unallocatedInvestigationsCount bigint;
unusualInProgressInvestigationsCount bigint;
completedInvestigationsCount bigint;
unusualCompletedNoContactInvestigationsCount bigint;
transferRequestInvestigationsCount bigint;
waitingForDetailsInvestigationsCount bigint;

BEGIN
	-- creating filtered investigations: all of the statistics will be pulled from here instead of just public.investigations
	CREATE TEMP TABLE filtered_investigations AS SELECT * FROM public.investigation 
	WHERE creator IN (
		SELECT id FROM public.user 
		WHERE investigation_group = (
			SELECT id FROM public.counties WHERE id = county_input
		)
	)
	-- only if desks_input is sent - add the filter  
	AND (desks_input is NULL OR desk_id IN (SELECT unnest(desks_input)))

	-- only if either start or end date filter is send - add the filter
	AND ( start_date_input is NULL OR end_date_input IS NULL OR creation_date BETWEEN start_date_input AND end_date_input);
	
	-- allInvestigations
	SELECT COUNT(epidemiology_number) INTO allInvestigationsCount FROM filtered_investigations;
	
	-- in process investigations
	SELECT COUNT(epidemiology_number) INTO inProcessCount FROM filtered_investigations
		WHERE investigation_status = 100000002;
	
	-- new investigations
	SELECT COUNT(epidemiology_number) INTO newInvestigationsCount FROM filtered_investigations
		WHERE investigation_status = 1;
		
	-- unassignedInvestigations
	SELECT COUNT(epidemiology_number) INTO unassignedInvestigationsCount FROM filtered_investigations
		WHERE creator IN (
			SELECT id FROM public.user 
			WHERE user_name = 'לא משויך'
		) AND investigation_status IN (1 , 100000002);
		
	-- inactiveInvestigations
	SELECT COUNT(epidemiology_number) INTO inactiveInvestigationsCount FROM filtered_investigations
		WHERE creator IN (
			SELECT id FROM public.user 
			WHERE user_name != 'לא משויך' AND is_active = false
		) AND investigation_status IN (1 , 100000002);
		
	-- unallocatedInvestigations
	SELECT COUNT(epidemiology_number) INTO unallocatedInvestigationsCount FROM filtered_investigations
		WHERE creator IN (
			SELECT id FROM public.user 
			WHERE user_name = 'לא משויך' OR is_active = false
		) AND investigation_status IN (1 , 100000002);
	
	
	-- unusualInProgressInvestigations
	SELECT COUNT(epidemiology_number) INTO unusualInProgressInvestigationsCount FROM filtered_investigations
		WHERE investigation_status = 100000002
		AND investigation_sub_status IN ('נדרשת העברה' , 'מחכה להשלמת פרטים',  'מחכה למענה')
		AND last_update_time <= current_date - interval '4 hours';
	
	-- unusualCompletedNoContactInvestigations
	SELECT COUNT(epidemiology_number) INTO unusualCompletedNoContactInvestigationsCount FROM (
		 SELECT inv.epidemiology_number, COUNT(coe.investigation_id) 
		 FROM public.contacted_person
			LEFT JOIN public.contact_event AS coe
				ON contacted_person.contact_event = coe.id
			RIGHT JOIN filtered_investigations AS inv
				ON inv.epidemiology_number = coe.investigation_id
		WHERE inv.investigation_status = 100000001	
		GROUP BY inv.epidemiology_number
		HAVING COUNT(coe.investigation_id) = 0
	) AS nonEmptyCompletedInvestigationsCount;
	
	-- transferRequestInvestigations
	SELECT COUNT(epidemiology_number) INTO transferRequestInvestigationsCount FROM filtered_investigations
		WHERE investigation_sub_status = 'נדרשת העברה';
	
	-- waitingForDetailsInvestigations
	SELECT COUNT(epidemiology_number) INTO waitingForDetailsInvestigationsCount FROM filtered_investigations
		WHERE investigation_sub_status = 'מחכה להשלמת פרטים';
	
	-- manualy dropping temp filtered_investigations table
	DROP TABLE filtered_investigations;
	
	-- returning a json object containing all of the statistics
	return json_build_object(
		'allInvestigations',allInvestigationsCount,
		'inProcessInvestigations',inProcessCount,
		'newInvestigations',newInvestigationsCount,
		'unassignedInvestigations',unassignedInvestigationsCount,
		'inactiveInvestigations',inactiveInvestigationsCount,
		'unallocatedInvestigations',unallocatedInvestigationsCount,
		'unusualInProgressInvestigations',unusualInProgressInvestigationsCount,
		'unusualCompletedNoContactInvestigations',unusualCompletedNoContactInvestigationsCount,
		'transferRequestInvestigations',transferRequestInvestigationsCount,
		'waitingForDetailsInvestigations',waitingForDetailsInvestigationsCount
	);
END;
$BODY$;

ALTER FUNCTION public.function_get_investigation_statistics(integer, integer[], date, date)
    OWNER TO coronai;