CREATE OR REPLACE FUNCTION public.delete_contact_event_function(
	contact_event_id integer,
	investigation_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$declare

begin

	perform public.delete_contacted_person_function(cp.id, cp.involved_contact_id, investigation_id)
	from contacted_person cp 
	where cp.contact_event = contact_event_id;
	
 	delete from contact_event 
 	where id = contact_event_id;
	
end;
$BODY$;