-- FUNCTION: public.update_contact_persons(json)

-- DROP FUNCTION public.update_contact_persons(json);

CREATE OR REPLACE FUNCTION public.update_contact_persons(
	contacted_persons json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--This function updates list of contacted person from avarious contacts 
contactPersonArr json[];
contactedPerson json;

extraInfo varchar;
personInfo int4;
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

identificationType int4;
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
creationSource int4;
currentContactSend boolean;

isStayAnotherCountry boolean;
transitDate timestamp;
fromCountry int4;
overseasComments varchar;

BEGIN 	
	-- contacted_persons is a JSON that can be recieved in 2 different structures: */
	
	contactPersonArr :=(
					SELECT array_agg(p_data.value)
					FROM json_array_elements(contacted_persons->'unSavedContacts'->'contacts') p_data
				  ); 
	IF contactPersonArr IS NULL THEN
	contactPersonArr :=(
					SELECT array_agg(p_data.value)
					FROM json_array_elements(contacted_persons) p_data
				  );	
	END IF;
				 
	-- Looping through contacted_person
	foreach contactedPerson IN array contactPersonArr 
	LOOP
			raise notice '%',contactedPerson;			 	 
		-- Getting the information out of the contact_persons arr JSON
		select trim(nullif((contactedPerson->'contactEvent')::text,'null'),'"')::int4 into contactEvent;
		select trim(nullif((contactedPerson->'firstName')::text,'null'),'"')  into firstName;
		select trim(nullif((contactedPerson->'lastName')::text,'null'),'"')  into lastName;
		select trim(nullif((contactedPerson->'gender')::text,'null'),'"')  into igender;
		select trim(nullif((contactedPerson->'phoneNumber')::text,'null'),'"')  into phoneNumber;
		select trim(nullif((contactedPerson->'identificationType')::text,'null'),'"')::int4 into identificationType;
		select trim(nullif((contactedPerson->'identificationNumber')::text,'null'),'"')  into identificationNumber;
		select trim(nullif((contactedPerson->'birthDate')::text,'null'),'"')::timestamp  into birthDate;
		select trim(nullif((contactedPerson->'additionalPhoneNumber')::text,'null'),'"')  into additionalPhoneNumber;
		select trim(nullif((contactedPerson->'extraInfo')::text,'null'),'"') into extraInfo;
		select trim(nullif((contactedPerson->'doesNeedIsolation')::text,'null'),'"')::boolean into doesNeedIsolation;
	   	select nullif(trim((contactedPerson->'personInfo')::text,'"'),'null')::int4 into personInfo;
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
		   
		select trim(nullif((contactedPerson->'isolationAddress'->'city')::text,'null'),'"')  into city;
		select trim(nullif((contactedPerson->'isolationAddress'->'street')::text,'null'),'"')  into street;
		select trim(nullif((contactedPerson->'isolationAddress'->'houseNum')::text,'null'),'"')  into houseNum;
		select trim(nullif((contactedPerson->'isolationAddress'->'apartment')::text,'null'),'"')  into apartment;
 		select trim(nullif((contactedPerson->'creationSource')::text,'null'),'"')::int4 into creationSource;
		
		select trim(nullif((contactedPerson->'isStayAnotherCountry')::text,'null'),'"')::boolean into isStayAnotherCountry;
		select trim(nullif((contactedPerson->'transitDate')::text,'null'),'"')::timestamp  into transitDate;
		select trim(nullif((contactedPerson->'fromCountry')::text,'null'),'"')::int4 into fromCountry;
		select trim(nullif((contactedPerson->'overseasComments')::text,'null'),'"') into overseasComments;
		
		addressId := insert_and_get_address_id(city, null, street, houseNum, apartment, null, null);
									 
	IF personInfo IS NOT NULL THEN
	    -- Updating person_info
		SELECT completion_time FROM public.person_contact_details pcd WHERE pcd.person_info = personInfo INTO completionTime;
		SELECT is_contact_send FROM public.person_contact_details pcd WHERE pcd.person_info = personInfo INTO currentContactSend;

 		raise notice 'update contacted person %', personInfo;
		-- Using upsert to the table person_contact_details
			INSERT INTO public.person_contact_details (
				person_info, is_contact_send, does_need_isolation, extra_info, isolation_address, family_relationship,
				occupation, does_have_background_diseases, does_feel_good, does_need_help_in_isolation, repeating_occurance_with_confirmed,
				does_live_with_confirmed, contact_status, does_work_with_crowd, relationship, completion_time,
				is_stay_another_country, transit_date, from_country_id, overseas_comments
			) VALUES (
				personInfo, false, doesNeedIsolation, extraInfo, addressId, familyRelationship,
				personOccupation, doesHaveBackgroundDiseases, doesFeelGood, doesNeedHelpInIsolation, repeatingOccuranceWithConfirmed,
				doesLiveWithConfirmed, contactStatus, doesWorkWithCrowd, personRelationship, 
				(
					CASE WHEN completionTime IS NULL AND contactStatus = 5 THEN NOW() 
					WHEN completionTime IS NOT NULL THEN completionTime
					ELSE NULL END
				),
                isStayAnotherCountry, transitDate, fromCountry, overseasComments
			) 
			ON CONFLICT (person_info)
			DO UPDATE
				SET does_need_isolation = doesNeedIsolation,
				extra_info = extraInfo,
				isolation_address = addressId,
				family_relationship = familyRelationship ,
				occupation = personOccupation,
				does_have_background_diseases = doesHaveBackgroundDiseases ,
				does_feel_good = doesFeelGood ,
				does_need_help_in_isolation = doesNeedHelpInIsolation ,
				repeating_occurance_with_confirmed = repeatingOccuranceWithConfirmed ,
				does_live_with_confirmed  = doesLiveWithConfirmed ,
				contact_status = contactStatus ,
				does_work_with_crowd = doesWorkWithCrowd,
				relationship = personRelationship,	
				is_contact_send = (CASE WHEN currentContactSend = true AND contactStatus in (5,8) THEN true 
										ELSE false END),
				completion_time = (CASE WHEN completionTime IS NULL AND contactStatus = 5 THEN NOW() 
										WHEN completionTime IS NOT NULL then completionTime
										ELSE NULL END),
				is_stay_another_country = isStayAnotherCountry,
				transit_date= transitDate,
				from_country_id= fromCountry,
				overseas_comments= overseasComments
				where person_contact_details.person_info = personInfo;
	    
	    	raise notice '%', identificationType;
			-- Updating public.person by the personInfo
		   	UPDATE public.person
				SET identification_type = identificationType,
					identification_number = identificationNumber,
					birth_date = birthDate,
					additional_phone_number  = additionalPhoneNumber,
					first_name = firstName,
					last_name = lastName,
					gender = igender,
					phone_number = phoneNumber
			WHERE person.id = personInfo;

			IF (involvedContactId IS NOT NULL ) THEN
				UPDATE public.involved_contact
				SET isolation_address = addressId
				WHERE id = involvedContactId;
			END IF;
	   ELSE
			INSERT INTO public.person (first_name, last_name, identification_type, identification_number, phone_number, additional_phone_number, gender, birth_date) 
			VALUES(firstName, lastName, identificationType, identificationNumber, phoneNumber, additionalPhoneNumber, igender, birthDate);
			
		    personId := currval('person_id_seq');
 			raise notice 'insert new person %', personId;   

		 	INSERT INTO public.contacted_person (
                person_info,contact_event, contact_type, creation_time,creation_source
            ) VALUES (
                personId, contactEvent, contactType, now(), creationSource
            );

	   	   	INSERT INTO public.person_contact_details (
			   	isolation_address, is_contact_send, person_info, relationship, extra_info,
	   	    	does_have_background_diseases, occupation, does_feel_good, does_need_help_in_isolation, 
	   	   		repeating_occurance_with_confirmed, does_live_with_confirmed, contact_status, family_relationship, does_work_with_crowd, does_need_isolation, creation_time,
				is_stay_another_country, transit_date, from_country_id, overseas_comments
			) 
	    	VALUES(
				addressId, false, personId, personRelationship, extraInfo,
	   		 	doesHaveBackgroundDiseases, personOccupation , doesfeelGood, doesNeedHelpInIsolation,
	   			repeatingOccuranceWithConfirmed, doesLiveWithConfirmed, contactStatus, familyRelationship, doesWorkWithCrowd, doesNeedIsolation, now(),
				isStayAnotherCountry, transitDate, fromCountry, overseasComments
			);
	   END IF;
	END LOOP;
END;
$BODY$;
