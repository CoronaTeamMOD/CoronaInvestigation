-- FUNCTION: public.add_contacts_from_bank(integer, json)

-- DROP FUNCTION public.add_contacts_from_bank(integer, json);

CREATE OR REPLACE FUNCTION public.add_contacts_from_bank(
	contact_event_id integer,
	contacts json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
/*adds contacted persons assigned to specified contacted_event*/
--Variables:

contacts_arr json[];
contact json;
extraInfo varchar;
personId int4;
contactType int4;

begin 
	contacts_arr :=(
					select array_agg(contacts_data)
					from json_array_elements(contacts->'contacts') contacts_data
				  );
	foreach contact in array contacts_arr 
	loop
		select trim(nullif((contact->'extraInfo')::text,'null'),'"') into extraInfo;
 		select trim(nullif((contact->'contactType')::text,'null'),'"')::int4 into contactType;
		select trim(nullif((contact->'personInfo')::text,'null'),'"')::int4 into personId;

		INSERT INTO public.contacted_person
			(person_info, contact_event,extra_info, contact_type)
			VALUES(personId, contact_event_id,extraInfo, contactType);
			
		INSERT INTO public.person_contact_details
			(person_info, contact_status, creation_time)
		VALUES(personId, 1, now())
		ON CONFLICT (person_info) DO NOTHING;
			
	end loop;
end;
$BODY$;