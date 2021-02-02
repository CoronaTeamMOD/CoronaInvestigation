CREATE OR REPLACE FUNCTION public.ordered_investigations(order_by character varying)
 RETURNS SETOF investigation
 LANGUAGE sql
 STABLE
AS $function$select * from investigation
order by
	CASE WHEN order_by='validationDateDESC' THEN (
	select validation_date::date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END ASC,
	CASE WHEN order_by='validationDateASC' THEN (
	select validation_date::date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END DESC,
	CASE WHEN order_by='epidemiologyNumberDESC' THEN investigation.epidemiology_number END DESC,
	CASE WHEN order_by='epidemiologyNumberASC' THEN investigation.epidemiology_number END ASC,
	CASE WHEN order_by='cityDESC' THEN (
	select display_name
	from public.cities
	where id = (
		select city from public.address
		where id = (
			select address from public.covid_patients
			where epidemiology_number = investigation.epidemiology_number
		)
	)
	) END DESC,
	CASE WHEN order_by='cityASC' THEN (
	select display_name
	from public.cities
	where id = (
		select city from public.address
		where id = (
			select address from public.covid_patients
			where epidemiology_number = investigation.epidemiology_number
		)
	)
	) END ASC,
	CASE WHEN order_by='ageDESC' THEN (
	select birth_date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END ASC,
	CASE WHEN order_by='ageASC' THEN (
	select birth_date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END DESC,
	CASE WHEN order_by='fullNameASC' THEN (
	select full_name
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END ASC,
	CASE WHEN order_by='fullNameDESC' THEN (
	select full_name
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END DESC,
	CASE WHEN order_by='investigationStatusDESC' THEN (select display_name from
															public.investigation_status
															where id = investigation.investigation_status)  END DESC,
	CASE WHEN order_by='investigationStatusASC' THEN (select display_name from
															public.investigation_status
															where id = investigation.investigation_status)  END ASC,
	CASE WHEN order_by='investigatorNameDESC' THEN (
	select user_name from public.user
	where id = investigation.creator
	) END DESC,
	CASE WHEN order_by='investigatorNameASC' THEN (
	select user_name from public.user
	where id = investigation.creator
	) END asc,
	CASE WHEN order_by='defaultOrder' THEN 
	(select validation_date::date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END DESC ,investigation.priority ASC;
$function$
;
