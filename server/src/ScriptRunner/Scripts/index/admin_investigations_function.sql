-- FUNCTION: public.admin_investigations(integer,integer[],character varying,timestamp without time zone,timestamp without time zone)

-- DROP FUNCTION public.admin_investigations(integer,integer[],character varying,start_date_input timestamp without time zone,end_date_input timestamp without time zone);

CREATE OR REPLACE FUNCTION public.admin_investigations(
	county_input integer,
	desks_input integer[],
	order_by character varying,
	start_date_input timestamp without time zone,
	end_date_input timestamp without time zone)
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
		DATE_PART('minute', NOW() at time zone 'utc' - creation_date)) AS minutes,
		inv.investigation_status, iss.display_name as sub_status, inv.status_reason
	from public.investigation inv
join public.covid_patients cp on cp.epidemiology_number = inv.epidemiology_number
join public.desks de on de.id = inv.desk_id
join public.user usr on usr.id = inv.creator
join public.investigation_sub_status iss on iss.parent_status = inv.investigation_status
where inv.investigation_status = 100000002
and creator IN (
	SELECT id FROM public.user 
	WHERE investigation_group = (
		SELECT id FROM public.counties WHERE id = county_input
	)
)
-- only if desks_input is sent - add the filter  
AND (desks_input is NULL OR inv.desk_id IN (SELECT unnest(desks_input)))

-- only if either start or end date filter is send - add the filter
AND ( start_date_input is NULL OR end_date_input IS NULL OR creation_date >= start_date_input AND creation_date < end_date_input)
	
order by
	CASE WHEN order_by in ('creation_dateDESC','hoursASC','minutesASC') THEN inv.creation_date END DESC,
	CASE WHEN order_by in ('creation_dateASC','hoursDESC','minutesDESC') THEN inv.creation_date END ASC,
	CASE WHEN order_by='desk_nameDESC' THEN de.desk_name END DESC,
	CASE WHEN order_by='desk_nameASC' THEN de.desk_name END ASC,
	CASE WHEN order_by='user_nameDESC' THEN usr.user_name END DESC,
	CASE WHEN order_by='user_nameASC' THEN usr.user_name END ASC,
	CASE WHEN order_by='defaultOrder' THEN inv.creation_date END DESC)
	src into res ;
return res;
END;
$BODY$;