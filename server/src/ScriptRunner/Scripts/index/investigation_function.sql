-- FUNCTION: public.ordered_investigations(character varying)

-- DROP FUNCTION public.admin_investigations(integer,integer[],character varying);

CREATE OR REPLACE FUNCTION public.admin_investigations(
	county_input integer,
	desks_input integer[],
	order_by character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
res json;
BEGIN

 SELECT JSON_AGG(src) as src
from (
select inv.epidemiology_number as id, inv.creation_date, de.desk_name, usr.user_name,
		(DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date)) AS hours,
		(DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 * 60 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date) * 60 +
		DATE_PART('minute', NOW() at time zone 'utc' - creation_date)) AS minutes
	from public.investigation inv
join public.covid_patients cp on cp.epidemiology_number = inv.epidemiology_number
join public.desks de on de.id = inv.desk_id
join public.user usr on usr.id = inv.creator
where inv.investigation_status = 100000002
and creator IN (
	SELECT id FROM public.user 
	WHERE investigation_group = (
		SELECT id FROM public.counties WHERE id = county_input
	)
)
AND (desks_input is NULL OR inv.desk_id IN (SELECT unnest(desks_input)))
order by
	CASE WHEN order_by='creation_dateDESC' THEN inv.creation_date END DESC,
	CASE WHEN order_by='creation_dateASC' THEN inv.creation_date END ASC,
	CASE WHEN order_by='investigationDeskDESC' THEN de.desk_name END DESC,
	CASE WHEN order_by='investigationDeskASC' THEN de.desk_name END ASC,
	CASE WHEN order_by='investigatorNameDESC' THEN usr.user_name END DESC,
	CASE WHEN order_by='investigatorNameASC' THEN usr.user_name END ASC,
	CASE WHEN order_by='hoursDESC' THEN (DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date)) END DESC,
	CASE WHEN order_by='hoursASC' THEN (DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date)) END ASC,
	CASE WHEN order_by='minutesDESC' THEN (DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 * 60 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date) * 60 +
		DATE_PART('minute', NOW() at time zone 'utc' - creation_date)) END DESC,
	CASE WHEN order_by='minutesASC' THEN (DATE_PART('day', NOW() at time zone 'utc' - creation_date) * 24 * 60 + 
		DATE_PART('hour', NOW() at time zone 'utc' - creation_date) * 60 +
		DATE_PART('minute', NOW() at time zone 'utc' - creation_date)) END ASC,
	CASE WHEN order_by='defaultOrder' THEN inv.creation_date END DESC)
	src into res ;
return res;
END;
$BODY$;