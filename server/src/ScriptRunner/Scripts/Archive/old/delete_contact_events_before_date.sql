CREATE OR REPLACE FUNCTION public.delete_contact_events_before_date(
	earliest_date character varying,
	curr_investigation_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE
personsIds integer[];
eventsIds integer[];

begin

	perform public.delete_contact_event_function(ce.id, ce.investigation_id)
	from public.contact_event ce
	where ce.start_time < to_timestamp(earliest_date, 'YYYY-MM-DD') and ce.investigation_id=curr_investigation_id;
	END;

$BODY$;