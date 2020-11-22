-- FUNCTION: public.update_contact_person(json, integer, integer)

-- DROP FUNCTION public.update_contact_person(json, integer, integer);

CREATE OR REPLACE FUNCTION public.update_contact_person(
	contacts json,
	contact_event_id integer,
	investigationid integer)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
AS $BODY$
declare
/*Update or insert  contacted persons  assigned to specified contacted_event*/
--Event variables:

person_arr json[];
person json;
firstName varchar;
lastName varchar;
phoneNumber varchar;
identificationNumber varchar;
identificationType varchar;
extraInfo varchar;
igender varchar;
contacted_person_id int4;
person_id int4;
contactType int4;

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
		select trim(nullif((person->'id')::text,'null'),'"')  into identificationNumber;
		select trim(nullif((person->'identificationType')::text,'null'),'"')  into identificationType;
		select trim(nullif((person->'gender')::text,'null'),'"') into igender;
	   	select trim(nullif((person->'serialId')::text,'null'),'"')::int4 into contacted_person_id;
 		select trim(nullif((person->'contactType')::text,'null'),'"')::int4 into contactType;
 	--identificationType
		if identificationNumber is not null then
	 	 	if exists(select 1
				from public.contacted_person cp join person p on cp.person_info = p.id join contact_event ce
				on ce.id = cp.contact_event
				where ce.investigation_id = investigationid and p.identification_number = identificationNumber
					and (cp.id <> contacted_person_id or contacted_person_id is null) and p.identification_number is not null
				having count(p.identification_number) > 0) then
					raise exception 'found duplicate ids:%', identificationnumber;
			end if;
		end if;
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
	    	identification_type = (case when identificationNumber is null then null
				 				  	     when identificationType is null then 'ת"ז'
				 				  	   else identificationType end)
	   from contacted_person
	    where person.id= contacted_person.person_info and contacted_person.id = contacted_person_id;

	   else
	    	raise notice 'insert contacted person';
	    	INSERT INTO public.person(first_name,
	    	last_name,phone_number,
	    	identification_type,
	    	identification_number)
			select firstName,lastName, phoneNumber,
					(case when identificationNumber is null then null
				 		  when identificationType is null then 'ת"ז'
				 		  else identificationType end),
				   		  identificationNumber  ;

			person_id := currval('person_id_seq');
			INSERT INTO public.contacted_person
			(person_info, contact_event,extra_info, contact_type, contact_status, creation_time)
			VALUES(person_id, contact_event_id,extraInfo, contactType, 1, now());
	    end if;
	end loop;
end;
$BODY$;

ALTER FUNCTION public.update_contact_person(json, integer, integer)
    OWNER TO coronai;

COMMENT ON FUNCTION public.update_contact_person(json, integer, integer)
    IS 'Update or insert  contacted persons  assigned to specified contacted_event';
