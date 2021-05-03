-- FUNCTION: public.close_isolate_contacts(integer)

DROP FUNCTION IF EXISTS public.close_isolate_contacts(integer);

CREATE OR REPLACE FUNCTION public.close_isolate_contacts(
	epi_number integer)
    RETURNS void
    LANGUAGE 'sql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
UPDATE public.person_contact_details SET contact_status = 5, completion_time = now()
WHERE person_info IN (
	SELECT person_info 
	FROM public.contacted_person
	WHERE contact_event IN 
	(
	 	SELECT id 
	 	FROM public.contact_event 
	 	WHERE investigation_id = epi_number
	)) 
	AND contact_status NOT IN (6,7) 
	AND completion_time IS NULL
	AND (
		(does_need_isolation IS true) OR
		(
			SELECT (id is not null) FROM public.person WHERE id = person_info AND
			first_name IS NOT NULL AND last_name IS NOT NULL AND phone_number IS NOT NULL
		) 
	);
$BODY$;