CREATE OR REPLACE FUNCTION public.update_contact_event_function(input_data json)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$declare
--Event variables:
placeType varchar;
placeName varchar;
investigationId int4;
locationAddress varchar;
startTime timestamp;
endTime timestamp;
isolationStartDate timestamp;
externalizationApproval bool;
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

areContactsEmpty boolean;

begin 
	
	-- General event details:
	curr_event :=(select value::text::int4 from json_each(input_data) where key='id');

	select (input_data->'deletedContacts') into deletedContacts;
	if deletedContacts is not null and deletedContacts::TEXT != '[]' then
		deletedContactsArr :=(select  array_agg(e_data.value) from json_array_elements(deletedContacts) e_data);
		foreach deletedContactsId in array deletedContactsArr 
		loop
			DELETE from public.contacted_person where id=deletedContactsId;
		end loop;
	end if;
	select nullif((input_data->'placeType')::text,'null') as val into placeType;
	select nullif((input_data->'placeName')::text,'null') as val into placeName;
	investigationId :=(select value::text::int4 from json_each(input_data) where key='investigationId') ;
	select nullif((input_data->'locationAddress')::text,'null') as val into locationAddress;
	startTime:= (select value::text::timestamp  from json_each(input_data) where key='startTime');
	endTime:=(select value::text::timestamp from json_each(input_data) where key='endTime');	
	externalizationApproval:=(select value::text::boolean from json_each(input_data) where key='externalizationApproval');
	contacts:=(select value from json_each(input_data) where key='contacts');
	placeSubType:=(select value::text::int4 from json_each(input_data) where key='placeSubType');
	contacted_number :=(select value::text::int4 from json_each(input_data) where key='contactedNumber');
	select nullif((input_data->'isolationStartDate')::text,'null')::timestamp as val into isolationStartDate;
	select nullif((input_data->'trainLine')::text,'null') as val into trainLine;
	select nullif((input_data->'airline')::text,'null') as val into iAirline;
	select nullif((input_data->'flightNum')::text,'null') as val into flightNum;
	select nullif((input_data->'busCompany')::text,'null') as val into busCompany;
	select nullif((input_data->'busLine')::text,'null') as val into busLine;
	select nullif((input_data->'grade')::text,'null') as val into igrade;
	select nullif((input_data->'boardingStation')::text,'null') as val into boardingStation;

	select nullif((input_data->'cityOrigin')::text,'null') as val into cityOrigin;
	select nullif((input_data->'endStation')::text,'null') as val into endStation;

	select nullif((input_data->'cityDestination')::text,'null') as val into cityDestination;
	select nullif((input_data->'contactPersonFirstName')::text,'null') as val into contactPersonFirstName;

	select nullif((input_data->'contactPersonLastName')::text,'null') as val into contactPersonLastName;
	select nullif((input_data->'contactPersonPhoneNumber')::text,'null') as val into contactPersonPhoneNumber;

	select nullif((input_data->'hospitalDepartment')::text,'null') as val into hospitalDepartment;
	select nullif((input_data->'flightDestinationAirport')::text,'null') as val into flightDestinationAirport;

	select nullif((input_data->'flightDestinationCity')::text,'null') as val into flightDestinationCity;
	select nullif((input_data->'flightDestinationCountry')::text,'null') as val into flightDestinationCountry;
	select nullif((input_data->'flightOriginAirport')::text,'null') as val into flightOriginAirport;
	select nullif((input_data->'flightOriginCity')::text,'null') as val into flightOriginCity;
	select nullif((input_data->'flightOriginCountry')::text,'null') as val into flightOriginCountry;

	select nullif((input_data->'contactPhoneNumber')::text,'null') as val into contactPhoneNumber;

if curr_event is null then
	insert into public.contact_event(investigation_id,
	allows_hamagen_data,
	start_time,
	end_time,
	place_name,
	place_type,
	place_sub_type,
	location_address,
	externalization_approval,
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
	creation_time
	)
	values(investigationId,
		allow_hamagen,
		startTime,
		endTime,
		trim(placeName,'"'),
	    trim(placeType,'"'),
		placeSubType,
		trim(locationAddress,'"'),
		externalizationApproval,
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
		now()
	);
	curr_event := currval('contact_event_id_seq');
else
	raise notice 'curr_event %',curr_event;
	UPDATE public.contact_event
	SET investigation_id=investigationId, 
	allows_hamagen_data=allow_hamagen, 
	start_time=startTime, 
	end_time=endTime, 
	place_name=trim(placeName,'"'), 
	bus_line=trim(busLine,'"'), 
	train_line=trim(trainLine,'"'), 
	bus_company=trim(busCompany,'"'),
	boarding_station=trim(boardingStation,'"'), 
	end_station=trim(endStation,'"'), 
	isolation_start_date=isolationStartDate, 
	externalization_approval=externalizationApproval, 
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
	hospital_department = trim(hospitalDepartment,'"')
	
WHERE id=curr_event;

end if;

	areContactsEmpty := contacts::TEXT = '[]';
	if 	contacts is not null and areContactsEmpty = false then
		perform public.update_contact_person(contacts,curr_event,investigationId);
	end if;

return curr_event;
end;
$function$
;
