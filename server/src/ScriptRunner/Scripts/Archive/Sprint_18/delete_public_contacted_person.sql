CREATE OR REPLACE FUNCTION public.delete_contacted_person_function(
	contacted_person_id integer,
	involved_contact_id integer,
	investigation_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN		
    -- I'm leaving this as a function in case einat changes her mind about deletion :P
	
	DELETE FROM public.contacted_person
   	WHERE id = contacted_person_id;
							
END;
$BODY$;