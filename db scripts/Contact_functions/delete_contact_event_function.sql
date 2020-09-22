CREATE OR REPLACE FUNCTION public.delete_contact_event_function(contact_event_id integer)
    RETURNS void
    LANGUAGE plpgsql
AS $function$declare

begin 
	delete from contacted_person cp 
	where cp.contact_event  = contact_event_id;
	
	delete from contact_event 
	where id = contact_event_id;
	
end;
$function$
;
