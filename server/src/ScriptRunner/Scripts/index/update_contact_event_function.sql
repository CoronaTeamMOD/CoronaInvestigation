-- FUNCTION: public.update_contact_event_function(json)

-- DROP FUNCTION public.update_contact_event_function(json);

CREATE OR REPLACE FUNCTION public.update_contact_event_function(
	input_data json)
    RETURNS integer[]
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--Event variables:
contact_events json;
contact_events_arr json[];
contact_event json;

isRepetitive bool;
placeType varchar;
placeName varchar;
placeDescription varchar;
investigationId int4;
locationAddress varchar;
startTime timestamp;
endTime timestamp;
isolationStartDate timestamp;
externalizationApproval bool;
externalizationApprovalDesc varchar;
contacts json;
placeSubType int4;
contacted_number int4;
allow_hamagen bool=false;
curr_event int4;
trainLine varchar;
busLine varchar;
iAirline varchar;
flightNum varchar;
busCompany varchar;

igrade varchar;
boardingStation varchar;
cityOrigin varchar;
endStation varchar;
cityDestination  varchar;
contactPersonFirstName varchar;
contactPersonLastName varchar;
contactPersonPhoneNumber varchar;
hospitalDepartment varchar;
flightDestinationAirport varchar;
flightDestinationCity varchar;
flightDestinationCountry varchar;
flightOriginAirport varchar;
flightOriginCity varchar;
flightOriginCountry varchar;
contactPhoneNumber varchar;
person_arr json[];
person json;

greenPass json;
green_pass_arr json[];

areContactsEmpty boolean;
deletedContacts json;
deletedContactsArr int4[];
deletedContactsId int4;
unknownTime boolean;
events_array int4[];
creationSource int4;

begin 
	select (input_data->'contactEvents') into contact_events;
	if contact_events is not null and contact_events::TEXT != '[]' then
		contact_events_arr :=(select  array_agg(events_data.value) from json_array_elements(contact_events) events_data);
		investigationId :=(select value::text::int4 from json_each(input_data) where key='investigationId');
			foreach contact_event in array contact_events_arr 
			loop
				-- General event details:
				curr_event :=(select value::text::int4 from json_each(contact_event) where key='id');
			
				select (contact_event->'deletedContacts') into deletedContacts;
				if deletedContacts is not null and deletedContacts::TEXT != '[]' then
					deletedContactsArr :=(select  array_agg(e_data.value) from json_array_elements(deletedContacts) e_data);
					foreach deletedContactsId in array deletedContactsArr 
					loop
						DELETE from public.contacted_person where id=deletedContactsId;
					end loop;
				end if;
				unknownTime := (contact_event->'unknownTime')::text::boolean; 
				select nullif((contact_event->'placeType')::text,'null') as val into placeType;
				select nullif((contact_event->'placeName')::text,'null') as val into placeName;
				select nullif((contact_event->'placeDescription')::text,'null') as val into placeDescription;
				select nullif((contact_event->'locationAddress')::text,'null') as val into locationAddress;
				startTime:= (select value::text::timestamp  from json_each(contact_event) where key='startTime');
				endTime:=(select value::text::timestamp from json_each(contact_event) where key='endTime');	
				externalizationApproval:=(select value::text::boolean from json_each(contact_event) where key='externalizationApproval');
				select nullif((contact_event->'externalizationApprovalDescription')::text,'null') as val into externalizationApprovalDesc;
				contacts:=(select value from json_each(contact_event) where key='contacts');
				placeSubType:=(select value::text::int4 from json_each(contact_event) where key='placeSubType');
				contacted_number :=(select value::text::int4 from json_each(contact_event) where key='contactedNumber');
				select nullif((contact_event->'isolationStartDate')::text,'null')::timestamp as val into isolationStartDate;
				select nullif((contact_event->'isRepetitive')::text,'null') as val into isRepetitive;
				select nullif((contact_event->'trainLine')::text,'null') as val into trainLine;
				select nullif((contact_event->'airline')::text,'null') as val into iAirline;
				select nullif((contact_event->'flightNum')::text,'null') as val into flightNum;
				select nullif((contact_event->'busCompany')::text,'null') as val into busCompany;
				select nullif((contact_event->'busLine')::text,'null') as val into busLine;
				select nullif((contact_event->'grade')::text,'null') as val into igrade;
				select nullif((contact_event->'boardingStation')::text,'null') as val into boardingStation;
			
				select nullif((contact_event->'cityOrigin')::text,'null') as val into cityOrigin;
				select nullif((contact_event->'endStation')::text,'null') as val into endStation;
			
				select nullif((contact_event->'cityDestination')::text,'null') as val into cityDestination;
				select nullif((contact_event->'contactPersonFirstName')::text,'null') as val into contactPersonFirstName;
			
				select nullif((contact_event->'contactPersonLastName')::text,'null') as val into contactPersonLastName;
				select nullif((contact_event->'contactPersonPhoneNumber')::text,'null') as val into contactPersonPhoneNumber;
			
				select nullif((contact_event->'hospitalDepartment')::text,'null') as val into hospitalDepartment;
				select nullif((contact_event->'flightDestinationAirport')::text,'null') as val into flightDestinationAirport;
			
				select nullif((contact_event->'flightDestinationCity')::text,'null') as val into flightDestinationCity;
				select nullif((contact_event->'flightDestinationCountry')::text,'null') as val into flightDestinationCountry;
				select nullif((contact_event->'flightOriginAirport')::text,'null') as val into flightOriginAirport;
				select nullif((contact_event->'flightOriginCity')::text,'null') as val into flightOriginCity;
				select nullif((contact_event->'flightOriginCountry')::text,'null') as val into flightOriginCountry;
			
				select nullif((contact_event->'contactPhoneNumber')::text,'null') as val into contactPhoneNumber;
				
				select (contact_event->'isGreenPass') into greenPass;
				if greenPass is not null and greenPass::TEXT != '[]' then
					green_pass_arr :=(select  array_agg(green_pass_data.value) from json_array_elements(greenPass) green_pass_data);
				end if;
				creationSource :=(select value::text::int4 from json_each(contact_event) where key='creationSource');
				if curr_event is null then
					insert into public.contact_event(investigation_id,
					is_repetitive,
					allows_hamagen_data,
					start_time,
					end_time,
					place_name,
					place_description,
					place_type,
					place_sub_type,
					location_address,
					externalization_approval,
					externalization_approval_desc,
					number_of_contacted,
					bus_line,
					airline,
					flight_num,
					bus_company,
					grade,
					boarding_station,
					city_origin,
					end_station ,
					city_destination ,
					contact_person_first_name ,
					contact_person_last_name ,
					contact_person_phone_number,
					hospital_department,
					flight_destination_airport ,
					flight_destination_city ,
					flight_destination_country ,
					flight_origin_airport,
					flight_origin_city,
					flight_origin_country,
					train_line,
					isolation_start_date,
					contact_Phone_Number,
					creation_time,
					unknown_time,
					creation_source
					)
					values(investigationId,
						isRepetitive,
						allow_hamagen,
						startTime,
						endTime,
						trim(placeName,'"'),
						trim(placeDescription, '"'),
					    trim(placeType,'"'),
						placeSubType,
						trim(locationAddress,'"'),
						externalizationApproval,
						trim(externalizationApprovalDesc,'"'),
						contacted_number,
						trim(busLine,'"'),
						trim(iAirline,'"'),
						trim(flightNum,'"'),
						trim(busCompany,'"'),
						trim(igrade,'"'),
						trim(boardingStation,'"'),
						trim(cityOrigin,'"'),
						trim(endStation,'"'),
						trim(cityDestination,'"'),
						trim(contactPersonFirstName,'"'),
						trim(contactPersonLastName,'"'),
						trim(contactPersonPhoneNumber,'"'),
						trim(hospitalDepartment, '""'),
						trim(flightDestinationAirport,'"'),
						trim(flightDestinationCity,'"'),
						trim(flightDestinationCountry,'"'),
						trim(flightOriginAirport,'"'),
						trim(flightOriginCity,'"'),
						trim(flightOriginCountry,'"'),
						trim(trainLine,'"'),
						isolationStartDate,
						trim(contactPhoneNumber,'"'),
						now(),
						unknownTime,
						creationSource
					);
					curr_event := currval('contact_event_id_seq');
					events_array := array_append(events_array, curr_event); 
				else
					raise notice 'curr_event %',curr_event;
					UPDATE public.contact_event
					SET investigation_id=investigationId, 
					is_repetitive=isRepetitive,
					allows_hamagen_data=allow_hamagen, 
					start_time=startTime, 
					end_time=endTime, 
					place_name=trim(placeName,'"'),
					place_description = trim(placeDescription, '"'),
					bus_line=trim(busLine,'"'), 
					train_line=trim(trainLine,'"'), 
					bus_company=trim(busCompany,'"'),
					boarding_station=trim(boardingStation,'"'), 
					end_station=trim(endStation,'"'), 
					isolation_start_date=isolationStartDate, 
					externalization_approval=externalizationApproval,
					externalization_approval_desc=trim(externalizationApprovalDesc,'"'),
					place_type=trim(placeType,'"'), 
					contact_phone_number=trim(contactPhoneNumber,'"'), 
					grade=trim(igrade,'"'),
					airline=trim(iAirline,'"'), 
					flight_num=trim(flightNum,'"'),
					contact_person_first_name=trim(contactPersonFirstName,'"'), 
					contact_person_last_name=trim(contactPersonLastName,'"'),
					contact_person_phone_number=trim(contactPersonPhoneNumber,'"'), 
					number_of_contacted=contacted_number,
					city_origin=trim(cityOrigin,'"'), 
					city_destination=trim(cityDestination,'"'),
					location_address=trim(locationAddress,'"'), 
					flight_origin_country=trim(flightOriginCountry,'"'), 
					flight_origin_city=	trim(flightOriginCity,'"'), 
					flight_origin_airport=trim(flightOriginAirport,'"'),  
					flight_destination_country=trim(flightDestinationCountry,'"'), 
					flight_destination_city=trim(flightDestinationCity,'"'),
					flight_destination_airport=trim(flightDestinationAirport,'"'),
					place_sub_type=placeSubType,
					hospital_department = trim(hospitalDepartment,'"'),
					unknown_time=unknownTime
				WHERE id=curr_event;
				events_array := array_append(events_array, curr_event); 
				
				end if;
				
				if green_pass_arr is not null then
					perform public.update_green_pass_information(green_pass_arr,curr_event,investigationId);
				else 
					DELETE from public.green_pass_information
						where investigation_id = investigationId and contact_event_id = curr_event;
				end if;

				areContactsEmpty := contacts::TEXT = '[]';
				if contacts is not null and areContactsEmpty = false then
					perform public.update_contact_person(contacts,curr_event,investigationId);
					events_array := array_append(events_array, curr_event);
				end if;
		
			end loop;
	end if;
return events_array;	
end;
$BODY$;

