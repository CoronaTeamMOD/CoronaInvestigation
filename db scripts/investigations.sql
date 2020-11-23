alter table investigation alter column investigated_patient_id set not null;
alter table investigation alter column investigation_status set not null;
alter table investigated_patient alter column covid_patient set not null;

CREATE OR REPLACE FUNCTION public.ordered_investigations(
	order_by character varying)
    RETURNS SETOF investigation 
    LANGUAGE 'sql'

    COST 100
    STABLE 
    ROWS 1000
AS $BODY$
select * from investigation
order by
			CASE WHEN order_by='defaultOrder' THEN 
			investigation.corona_test_date::date END DESC,
			CASE WHEN order_by='defaultOrder' THEN
			investigation.priority END ASC,
			CASE WHEN order_by='coronaTestDateDESC' THEN investigation.corona_test_date::date END DESC,
			CASE WHEN order_by='coronaTestDateASC' THEN investigation.corona_test_date::date END ASC,
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
			CASE WHEN order_by='investigationStatusDESC' THEN investigation.investigation_status  END DESC,
 			CASE WHEN order_by='investigationStatusASC' THEN investigation.investigation_status  END ASC,
			CASE WHEN order_by='investigatorNameDESC' THEN (
				select user_name from public.user
				where id = investigation.creator
			) END DESC,
 			CASE WHEN order_by='investigatorNameASC' THEN (
				select user_name from public.user
				where id = investigation.creator
			) END ASC;
$BODY$;

drop function user_investigations_sort(character varying, character varying);
drop function group_investigations_sort(integer, character varying);