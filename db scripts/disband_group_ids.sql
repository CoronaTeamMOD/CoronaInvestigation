DECLARE 
group_id_to_disband uuid;
investigation_numbers integer[];
BEGIN

	
	FOREACH group_id_to_disband in array group_ids
	loop
			investigation_numbers := (SELECT array_agg(epidemiology_number)
									  FROM public.investigation
									  WHERE group_id = group_id_to_disband);
			PERFORM update_grouped_investigations(investigation_numbers, null);	
	END LOOP; 
	
	DELETE 
	FROM public.investigation_group
	WHERE id in (select unnest(group_ids));
	
END
