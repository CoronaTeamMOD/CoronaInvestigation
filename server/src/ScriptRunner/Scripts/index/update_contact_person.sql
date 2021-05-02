-- FUNCTION: public.update_contact_person(json, integer, integer)

DROP FUNCTION IF EXISTS public.update_contact_person(json, integer, integer);

CREATE OR REPLACE FUNCTION public.update_contact_person(
	contacts json,
	contact_event_id integer,
	investigationid integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--Update or insert  contacted persons  assigned to specified contacted_event
--Variables:

person_arr json[];
person json;
firstName varchar;
lastName varchar;
phoneNumber varchar;
identificationNumber varchar;
identificationType int4;
extraInfo varchar;
igender varchar;
contacted_person_id int4;
personId int4;
contactType int4;
involvedContactId int4;
familyRelationship int4;
doesInvovledContactExist boolean;

begin 
	if contact_event_id is null then
		RAISE EXCEPTION 'contact_event_id got null';
	end if;
	--contacts:=(select value from json_each(contacted_people) where key='contacts');
	if contacts is null then
		RAISE EXCEPTION 'contacts got null';
	end if;
	person_arr :=(
					select  array_agg(p_data.value)
					from json_array_elements(contacts) p_data
				  );
	foreach person in array person_arr 
	loop
		select trim(nullif((person->'firstName')::text,'null'),'"') into firstName;
		select trim(nullif((person->'lastName')::text,'null'),'"') into lastName;
		select trim(nullif((person->'phoneNumber')::text,'null'),'"') into phoneNumber;
		select trim(nullif((person->'extraInfo')::text,'null'),'"') into extraInfo;
		select trim(nullif((person->'identificationNumber')::text,'null'),'"')  into identificationNumber;
		select trim(nullif((person->'identificationType')::text,'null'),'"')::int4 into identificationType;
		select trim(nullif((person->'gender')::text,'null'),'"') into igender;
	   	select trim(nullif((person->'id')::text,'null'),'"')::int4 into contacted_person_id;  
 		select trim(nullif((person->'contactType')::text,'null'),'"')::int4 into contactType;
		select trim(nullif((person->'involvedContactId')::text,'null'),'"')::int4 into involvedContactId;
		select trim(nullif((person->'familyRelationship')::text,'null'),'"')::int4 into familyRelationship;
	    if contacted_person_id is not null then
	    	raise notice 'UPDATE contacted person';
			/*update person and contacted person */
	    update contacted_person 
	    set extra_info = extraInfo,
		contact_type = contactType
	    where id = contacted_person_id ;
		
	    update person 
	    set first_name = firstName,
	    	last_name  = LastName,
	    	phone_number = phoneNumber,
	    	identification_Number = identificationNumber,
	    	identification_type = identificationType
	   	from contacted_person 
	    where person.id= contacted_person.person_info and contacted_person.id = contacted_person_id;
	
	   else 
	   		if (involvedContactId is not null)  then
				INSERT INTO public.contacted_person
				(person_info, contact_event, contact_type, creation_time)
				select person_id, contact_event_id, contactType, now()
				from public.involved_contact ic
				where id = involvedContactId ;
				
				INSERT INTO public.person_contact_details
				(person_info, contact_status, creation_time, isolation_address, involved_contact_id, family_relationship)
				SELECT person_id, 1, now(), ic.isolation_address, involvedContactId, familyRelationship
				from public.involved_contact ic
				where id = involvedContactId ;
				
				UPDATE public.involved_contact
				SET contact_type = 1,
				is_contacted_person = true
				where id = involvedContactId ;
			else
				raise notice 'insert contacted person';
				INSERT INTO public.person(
				first_name, 
				last_name,
				phone_number, 
				identification_type,
				identification_number
				)
				VALUES(firstName,lastName, phoneNumber, identificationType, identificationNumber);

				personId := currval('person_id_seq');
				INSERT INTO public.contacted_person
				(person_info, contact_event,extra_info, contact_type)
				VALUES(personId, contact_event_id,extraInfo, contactType);
				
				INSERT INTO public.person_contact_details
				(person_info, contact_status, creation_time)
				VALUES(personId, 1, now());
			
			end if;
	    end if;
	end loop;
end;
$BODY$;