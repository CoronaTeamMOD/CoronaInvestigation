CREATE OR REPLACE FUNCTION public.update_contact_person(contacts json, contact_event_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
--Event variables:

person_arr json[];
person json;
firstName varchar;
lastName varchar;
phoneNumber varchar;
identificationNumber varchar;
doesNeedIsolation boolean;
extraInfo varchar;
igender varchar;
contacted_person_id int4;
person_id int4;



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
		select trim(nullif((person->'gender')::text,'null'),'"') into igender;
		select trim(nullif((person->'doesNeedIsolation')::text,'null'),'"')::boolean into doesNeedIsolation;
	   	select trim(nullif((person->'serialId')::text,'null'),'"')::int4 into contacted_person_id;  
 
	    if contacted_person_id is not null then
	    	
			/*update person and contacted person */
	    update contacted_person 
	    set "	 does_need_isolation" = doesNeedIsolation
	    where id = contacted_person_id ;
	    
	    update person 
	    set first_name = firstName,
	    	last_name  = LastName,
	    	phone_number = phoneNumber,
	    	identification_Number = identificationNumber,
	    	identification_type = case when identificationNumber is null then null else person.identification_type end
	   from contacted_person 
	    where person.id= contacted_person.person_info and contacted_person.id = contacted_person_id;
	    else
	    	INSERT INTO public.person(first_name, last_name,phone_number, identification_type, identification_number)
			VALUES(firstName,lastName, phoneNumber, 'ת"ז', identificationNumber);
			person_id := currval('person_id_seq');
			INSERT INTO public.contacted_person
			(person_info, contact_event,"	 does_need_isolation",extra_info)
			VALUES(person_id, contact_event_id,doesNeedIsolation,extraInfo);
	    end if;
	end loop;
end;
$function$
;
