-- FUNCTION: public.ordered_investigations(character varying)

-- DROP FUNCTION public.ordered_investigations(character varying);

CREATE OR REPLACE FUNCTION public.ordered_investigations(
	order_by character varying)
    RETURNS SETOF investigation 
    LANGUAGE 'sql'
    COST 100
    STABLE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
select * from investigation
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
	CASE WHEN order_by='subOccupationDESC' THEN (
	select sub_occupation.display_name FROM public.sub_occupation
	join public.investigated_patient ON sub_occupation.id = investigated_patient.sub_occupation
	where investigated_patient.id = investigation.investigated_patient_id
	) END DESC,
	CASE WHEN order_by='subOccupationASC' THEN (
	select sub_occupation.display_name FROM public.sub_occupation
	join public.investigated_patient ON sub_occupation.id = investigated_patient.sub_occupation
	where investigated_patient.id = investigation.investigated_patient_id
	) END ASC,
	CASE WHEN order_by='investigationDeskDESC' THEN (
	select desk_name FROM public.desks
	where id = investigation.desk_id
	) END DESC,
	CASE WHEN order_by='investigationDeskASC' THEN (
	select desk_name FROM public.desks
	where id = investigation.desk_id
	) END ASC,
	CASE WHEN order_by='investigatorNameDESC' THEN (
	select user_name from public.user
	where id = investigation.creator
	) END DESC,
	CASE WHEN order_by='investigatorNameASC' THEN (
	select user_name from public.user
	where id = investigation.creator
	) END asc,
	CASE WHEN order_by='chatStatusDESC' THEN (
	select chat_status.display_name FROM public.bot_investigation
	join public.chat_status ON bot_investigation.chat_status_id = chat_status.id
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END DESC,
	CASE WHEN order_by='chatStatusASC' THEN (
	select chat_status.display_name FROM public.bot_investigation
	join public.chat_status ON bot_investigation.chat_status_id = chat_status.id
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END ASC,
	CASE WHEN order_by='lastChatDateDESC' THEN (
	select last_chat_date::date FROM public.bot_investigation
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END DESC,
	CASE WHEN order_by='lastChatDateASC' THEN (
	select last_chat_date::date FROM public.bot_investigation
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END ASC,
	CASE WHEN order_by='investigatorReferenceStatusDESC' THEN (
	select investigator_reference_status.display_name FROM public.bot_investigation
	join public.investigator_reference_status  ON bot_investigation.investigator_reference_status_id = investigator_reference_status.id
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END DESC,
	CASE WHEN order_by='investigatorReferenceStatusASC' THEN (
	select investigator_reference_status.display_name FROM public.bot_investigation
	join public.investigator_reference_status  ON bot_investigation.investigator_reference_status_id = investigator_reference_status.id
	where investigation.epidemiology_number = bot_investigation.epidemiology_number
	) END ASC,
	CASE WHEN order_by='defaultOrder' THEN 
	(select validation_date::date
	from public.covid_patients
	where epidemiology_number = investigation.epidemiology_number) END DESC ,investigation.priority ASC;
$BODY$;


