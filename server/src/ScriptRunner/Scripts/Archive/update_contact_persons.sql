CREATE OR REPLACE FUNCTION public.update_contact_persons(contacted_persons json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
--This function updates list of contacted person from avarious contacts 
contactPersonArr json[];
contactedPerson json;

extraInfo varchar;
contactedPersonId int4;
contactType int4;

doesNeedIsolation boolean;
personRelationship varchar;
familyRelationship int4;
personOccupation varchar;

doesHaveBackgroundDiseases bool;
doesFeelGood bool;
doesNeedHelpInIsolation bool;
repeatingOccuranceWithConfirmed bool;
doesLiveWithConfirmed bool;
contactStatus int4;
doesWorkWithCrowd bool;

firstName varchar;
lastName varchar;
phoneNumber varchar;
igender varchar;

identificationType varchar;
identificationNumber varchar;
birthDate timestamp;
additionalPhoneNumber varchar;
personId int4;
contactEvent int4;
completionTime timestamp;
involvedContactId int4;

addressId integer;
city varchar;
street varchar;
houseNum varchar;
apartment varchar;

begin 	
	/*contacted_persons is a Jsonthat may recieved in 2 different structures: */
	
	contactPersonArr :=(
					select  array_agg(p_data.value)
					from json_array_elements(contacted_persons->'unSavedContacts'->'contacts') p_data
				  );
	if contactPersonArr is null then
	contactPersonArr :=(
					select  array_agg(p_data.value)
					from json_array_elements(contacted_persons) p_data
				  );	
	end if;
				 
				 
	foreach contactedPerson in array contactPersonArr 
	loop
			raise notice '%',contactedPerson;			 	 
		
		select trim(nullif((contactedPerson->'contactEvent')::text,'null'),'"')::int4 into contactEvent;
		select trim(nullif((contactedPerson->'firstName')::text,'null'),'"')  into firstName;
		select trim(nullif((contactedPerson->'lastName')::text,'null'),'"')  into lastName;
		select trim(nullif((contactedPerson->'gender')::text,'null'),'"')  into igender;
		select trim(nullif((contactedPerson->'phoneNumber')::text,'null'),'"')  into phoneNumber;
		select trim(nullif((contactedPerson->'identificationType')::text,'null'),'"') into identificationType;
		select trim(nullif((contactedPerson->'identificationNumber')::text,'null'),'"')  into identificationNumber;
		select trim(nullif((contactedPerson->'birthDate')::text,'null'),'"')::timestamp  into birthDate;
		select trim(nullif((contactedPerson->'additionalPhoneNumber')::text,'null'),'"')  into additionalPhoneNumber;
		select trim(nullif((contactedPerson->'extraInfo')::text,'null'),'"') into extraInfo;
		select trim(nullif((contactedPerson->'doesNeedIsolation')::text,'null'),'"')::boolean into doesNeedIsolation;
	   	select nullif(trim((contactedPerson->'id')::text,'"'),'null')::int4 into contactedPersonId;
	    select trim(nullif((contactedPerson->'contactType')::text,'null'),'"')::int4 into contactType;
		select trim(nullif((contactedPerson->'relationship')::text,'null'),'"') into personRelationship;
 		select trim(nullif((contactedPerson->'familyRelationship')::text,'null'),'"')::int4 into familyRelationship;
 		select trim(nullif((contactedPerson->'occupation')::text,'null'),'"') into personOccupation;
 		select nullif((contactedPerson->'doesHaveBackgroundDiseases')::text,'null')::bool into doesHaveBackgroundDiseases;	
 		select nullif((contactedPerson->'doesFeelGood')::text,'null')::bool into doesFeelGood;
		select nullif((contactedPerson->'doesNeedHelpInIsolation')::text,'null')::bool into doesNeedHelpInIsolation;
		select nullif((contactedPerson->'repeatingOccuranceWithConfirmed')::text,'null')::bool into repeatingOccuranceWithConfirmed;
		select nullif((contactedPerson->'doesLiveWithConfirmed')::text,'null')::bool into doesLiveWithConfirmed;
		select nullif((contactedPerson->'contactStatus')::text,'null')::int4 into contactStatus;
		select nullif((contactedPerson->'involvedContactId')::text,'null')::int4 into involvedContactId;
		select nullif((contactedPerson->'doesWorkWithCrowd')::text,'null')::bool into doesWorkWithCrowd;
		    identificationType:= REPLACE(identificationType, '\', '' );
		   
		select trim(nullif((contactedPerson->'isolationAddress'->'city')::text,'null'),'"')  into city;
		select trim(nullif((contactedPerson->'isolationAddress'->'street')::text,'null'),'"')  into street;
		select trim(nullif((contactedPerson->'isolationAddress'->'houseNum')::text,'null'),'"')  into houseNum;
		select trim(nullif((contactedPerson->'isolationAddress'->'apartment')::text,'null'),'"')  into apartment;
 
		  
		addressId := insert_and_get_address_id(city, null, street, houseNum, apartment, null, null);
									 

		if contactedPersonId is not null then
	    	/*update person and contacted person */
		select completion_time from contacted_person cp where cp.id = contactedPersonId into completionTime;
	
 		raise notice 'update contacted person %', contactedPersonId;
	    	update contacted_person 
	    	set does_need_isolation = doesNeedIsolation,
			extra_info = extraInfo,
			isolation_address = addressId,
			contact_type = contactType,
			family_relationship=familyRelationship ,
			occupation = personOccupation,
			does_have_background_diseases = doesHaveBackgroundDiseases ,
			does_feel_good =doesFeelGood ,
			does_need_help_in_isolation =doesNeedHelpInIsolation ,
			repeating_occurance_with_confirmed =repeatingOccuranceWithConfirmed ,
			does_live_with_confirmed  =doesLiveWithConfirmed ,
			contact_status =contactStatus ,
			does_work_with_crowd = doesWorkWithCrowd,
			relationship=	personRelationship,	
			completion_time = (case when completionTime is null and contactStatus = 5 then now() 
									when completionTime is not null then completionTime
									else null end)
			where id = contactedPersonId;
	    
	    	raise notice '%', identificationType;
		   update person 
	    	set identification_type = (case when identificationNumber is null then null
				 				  	     when identificationType is null then 'ת"ז' 
				 				  	   else identificationType end),
	    		identification_number =identificationNumber,
	  		  	birth_date = birthDate,
	  		  	additional_phone_number  = additionalPhoneNumber,
	  		  	first_name = firstName,
	  		  	last_name =lastName,
	  		  	gender= igender,
	  		  	phone_number = phoneNumber
			from contacted_person 
	    	where person.id= contacted_person.person_info and contacted_person.id = contactedPersonId;

			if (involvedContactId is not null ) then
				update public.involved_contact
				set isolation_city = city
				where id = involvedContactId;
			end if;
	   else
			INSERT INTO public.person (first_name, last_name, identification_type, identification_number, phone_number, additional_phone_number, gender, birth_date) 
			VALUES(firstName, lastName,  (case when identificationNumber is null then null
				 				  	     when identificationType is null then 'ת"ז' 
				 				  	   else identificationType end),
			identificationNumber, phoneNumber, additionalPhoneNumber, igender, birthDate);
			
		    personId := currval('person_id_seq');
 		raise notice 'insert new person %', personId	;   
	   	   INSERT INTO public.contacted_person (isolation_address,person_info, contact_event, relationship, extra_info, contact_type, 
	   	    does_have_background_diseases, occupation, does_feel_good, does_need_help_in_isolation, 
	   	   repeating_occurance_with_confirmed, does_live_with_confirmed, contact_status, family_relationship, does_work_with_crowd, does_need_isolation, creation_time) 
	    VALUES(addressId,personId, contactEvent, personRelationship, extraInfo, contactType, 
	   		 doesHaveBackgroundDiseases, personOccupation , doesfeelGood, doesNeedHelpInIsolation,
	   		repeatingOccuranceWithConfirmed, doesLiveWithConfirmed, contactStatus, familyRelationship, doesWorkWithCrowd, doesNeedIsolation, now());

	   end if;
	end loop;
end;
$function$
;