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
familyRelationship varchar;
personOccupation varchar;
contactedPersonCity varchar;
doesHaveBackgroundDiseases bool;
doesFeelGood bool;
doesNeedHelpInIsolation bool;
repeatingOccuranceWithConfirmed bool;
doesLiveWithConfirmed bool;
cantReachContact bool;
doesWorkWithCrowd bool;

identificationType varchar;
identificationNumber varchar;
birthDate timestamp;
additionalPhoneNumber varchar;

begin 

	
	
	contactPersonArr :=(
					select  array_agg(p_data.value)
					from json_array_elements(contacted_persons->'data'->'allContactedPeople'->'nodes') p_data
				  );
				 	 
				 
	foreach contactedPerson in array contactPersonArr 
	loop
		select trim(nullif((contactedPerson->'personByPersonInfo'->'identificationType')::text,'null'),'"') into identificationType;
		select trim(nullif((contactedPerson->'personByPersonInfo'->'identificationNumber')::text,'null'),'"')  into identificationNumber;
		select trim(nullif((contactedPerson->'personByPersonInfo'->'birthDate')::text,'null'),'"')::timestamp  into birthDate;
		select trim(nullif((contactedPerson->'personByPersonInfo'->'additionalPhoneNumber')::text,'null'),'"')  into additionalPhoneNumber;

		select trim(nullif((contactedPerson->'extraInfo')::text,'null'),'"') into extraInfo;
		select trim(nullif((contactedPerson->'doesNeedIsolation')::text,'null'),'"')::boolean into doesNeedIsolation;
	   	select nullif(trim((contactedPerson->'id')::text,'"'),'null')::int4 into contactedPersonId;

	   select trim(nullif((contactedPerson->'contactType')::text,'null'),'"')::int4 into contactType;
		
 		select trim(nullif((contactedPerson->'relationship')::text,'null'),'"') into personRelationship;
 		select trim(nullif((contactedPerson->'familyRelationship')::text,'null'),'"') into familyRelationship;
 		select trim(nullif((contactedPerson->'occupation')::text,'null'),'"') into personOccupation;
 		select nullif((contactedPerson->'doesHaveBackgroundDiseases')::text,'null')::bool into doesHaveBackgroundDiseases;	
 		select nullif((contactedPerson->'doesFeelGood')::text,'null')::bool into doesFeelGood;
		select nullif((contactedPerson->'doesNeedHelpInIsolation')::text,'null')::bool into doesNeedHelpInIsolation;
		select nullif((contactedPerson->'repeatingOccuranceWithConfirmed')::text,'null')::bool into repeatingOccuranceWithConfirmed;
		select nullif((contactedPerson->'doesLiveWithConfirmed')::text,'null')::bool into doesLiveWithConfirmed;
		select nullif((contactedPerson->'cantReachContact')::text,'null')::bool into cantReachContact;
		select nullif((contactedPerson->'doesWorkWithCrowd')::text,'null')::bool into doesWorkWithCrowd;
 		if contactedPersonId is not null then
	    	/*update person and contacted person */
	    	update contacted_person 
	    	set does_need_isolation = doesNeedIsolation,
			extra_info = extraInfo,
			contact_type = contactType,
			family_relationship=familyRelationship ,
			occupation = personOccupation ,
			contacted_person_city =contactedPersonCity ,
			does_have_background_diseases = doesHaveBackgroundDiseases ,
			does_feel_good =doesFeelGood ,
			does_need_help_in_isolation =doesNeedHelpInIsolation ,
			repeating_occurance_with_confirmed =repeatingOccuranceWithConfirmed ,
			does_live_with_confirmed  =doesLiveWithConfirmed ,
			cant_reach_contact =cantReachContact ,
			does_work_with_corwd = doesWorkWithCrowd,
			relationship=	personRelationship 
			where id = contactedPersonId ;
	    
	    	update person 
	    	set identification_type = REPLACE(identificationType, '\', '' ),
	    		identification_number =identificationNumber,
	  		  birth_date = birthDate,
	  		  additional_phone_number  = additionalPhoneNumber
			from contacted_person 
	    	where person.id= contacted_person.person_info and contacted_person.id = contactedPersonId;
	    end if;
	end loop;
end;
$function$
;
