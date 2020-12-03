DECLARE 
investigation_group_id uuid;
grouped_investigations_count integer;
BEGIN
	
	investigation_group_id := (SELECT group_id
							   FROM public.investigation
							   WHERE epidemiology_number = epidemiology_number_to_exclude);
				
	UPDATE public.investigation
	SET group_id = null
	WHERE epidemiology_number = epidemiology_number_to_exclude;
	
	grouped_investigations_count := (SELECT COUNT(*)
									 FROM public.investigation
									 WHERE group_id = investigation_group_id);
									
	IF grouped_investigations_count = 0 THEN
		DELETE 
		FROM public.investigation_group
		WHERE id = investigation_group_id;
	END IF;

END
