-- FUNCTION: public.function_get_investigation_statistics(integer, integer[], timestamp without time zone, timestamp without time zone)

-- DROP FUNCTION public.function_get_investigation_statistics(integer, integer[], timestamp without time zone, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.function_get_investigation_statistics(
	county_input integer,
	desks_input integer[],
	start_date_input timestamp without time zone,
	end_date_input timestamp without time zone)
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
unallocatedDeskInvestigationsCount bigint;
incompletedBotInvestigationsCount bigint;
tenHoursAgo timestamp without time zone;
fourHoursAgo timestamp without time zone;
twoHoursAgo  timestamp without time zone;

BEGIN

select now() - interval '2 hours' into twoHoursAgo;
select now() - interval '4 hours' into fourHoursAgo;
select now() - interval '10 hours' into tenHoursAgo;

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
	AND ( start_date_input is NULL OR end_date_input IS NULL OR creation_date >= start_date_input AND creation_date < end_date_input);
	
	-- allInvestigations
	SELECT COUNT(epidemiology_number) INTO allInvestigationsCount FROM filtered_investigations;
	
	-- in process investigations
	SELECT COUNT(epidemiology_number) INTO inProcessCount FROM filtered_investigations
		WHERE investigation_status = 100000002;
	
	-- new investigations
	SELECT COUNT(epidemiology_number) INTO newInvestigationsCount FROM filtered_investigations
		WHERE investigation_status = 1;
		
	-- unallocatedInvestigations
	SELECT COUNT(epidemiology_number) INTO unallocatedInvestigationsCount FROM filtered_investigations
		WHERE creator IN (
			SELECT id FROM public.user 
			WHERE user_name = 'לא משויך' OR is_active = false
		) AND investigation_status IN (1 , 100000002);
	
	
	-- unusualInProgressInvestigations
	SELECT COUNT(epidemiology_number) INTO unusualInProgressInvestigationsCount FROM filtered_investigations
		WHERE investigation_status = 100000002
		AND start_time <= fourHoursAgo;
	
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
	
	-- unallocatedDeskInvestigationsCount
	SELECT COUNT(epidemiology_number) INTO unallocatedDeskInvestigationsCount FROM filtered_investigations
		WHERE desk_id is null
		AND investigation_status IN (1 , 100000002);
		
	--incompletedBotInvestigationsCount
	
	SELECT COUNT (epidemiology_number) INTO incompletedBotInvestigationsCount FROM (
		SELECT i.epidemiology_number FROM filtered_investigations i
		INNER JOIN bot_investigation b
		ON i.epidemiology_number = b.epidemiology_number
		WHERE
		(b.chat_status_id IN (1,3,9,10,14,15) AND i.investigation_status=1) OR
		(i.investigation_status=1 AND b.last_chat_date < tenHoursAgo) OR
		(i.investigation_status =100000002 AND i.last_updator_user = 'admin.group9995'
		 AND  b.last_chat_date < twoHoursAgo) OR
		(i.investigation_status = 100000001 AND b.investigator_reference_status_id IN (1,2))
	) AS incompletedBotInvs;
	
	-- manualy dropping temp filtered_investigations table
	DROP TABLE filtered_investigations;
	
	-- returning a json object containing all of the statistics
	return json_build_object(
		'allInvestigations',allInvestigationsCount,
		'inProcessInvestigations',inProcessCount,
		'newInvestigations',newInvestigationsCount,
		'unallocatedInvestigations',unallocatedInvestigationsCount,
		'unusualInProgressInvestigations',unusualInProgressInvestigationsCount,
		'unusualCompletedNoContactInvestigations',unusualCompletedNoContactInvestigationsCount,
		'transferRequestInvestigations',transferRequestInvestigationsCount,
		'waitingForDetailsInvestigations',waitingForDetailsInvestigationsCount,
		'unallocatedDeskInvestigations',unallocatedDeskInvestigationsCount,
		'incompletedBotInvestigations',incompletedBotInvestigationsCount
	);
END;
$BODY$;

