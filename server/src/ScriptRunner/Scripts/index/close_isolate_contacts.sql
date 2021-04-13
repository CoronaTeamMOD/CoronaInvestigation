CREATE OR REPLACE FUNCTION public.close_isolate_contacts(
	epi_number integer)
    RETURNS void
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
UPDATE public.contacted_person SET contact_status = 5, completion_time = now()
WHERE contact_event IN 
	(
	 SELECT id 
	 FROM public.contact_event 
	 WHERE investigation_id = epi_number) AND
	 completion_time IS NULL AND (
		 (does_need_isolation IS true) OR
 		 (
 			 SELECT (id is not null) FROM public.person WHERE id = person_info AND
		  	 first_name IS NOT NULL AND last_name IS NOT NULL AND phone_number IS NOT NULL
 		 ) 
	 ) AND contact_status NOT IN (6,7)
$BODY$;