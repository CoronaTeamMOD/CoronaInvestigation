CREATE OR REPLACE FUNCTION public.update_exposures_function(input_exposures json)
    RETURNS void
    LANGUAGE plpgsql
AS $function$declare
--Event variables:
declare
investigationId int4;
exposures json;
exposure_arr json[];
exposure json;

wasConfirmedExposure bool;
exposureFirstName varchar;
exposureLastName varchar;
wasAbroad bool;
flightStartDate timestamp;
pAirLine varchar;
flightNum varchar ;
exposurePlaceName varchar;
exposurePlaceType varchar;
exposureDate timestamp;
flightEndDate timestamp;
exposureAddress varchar;
exposurePlaceSubType int4;
flightOriginCountry varchar;
flightOriginCity varchar;
flightOriginAirport varchar;
flightDestinationCountry varchar;
flightDestinationCity varchar;
flightDestinationAirport varchar;
exposure_id int4;
begin
	raise notice 'func began...';	
	select nullif(trim((input_exposures->'investigationId')::text,'"'),'null')::int4 into investigationId;
	select (input_exposures->'exposures') into exposures;
	if exposures is not null and exposures::TEXT != '[]' then
		exposure_arr :=(select  array_agg(e_data.value) from json_array_elements(exposures) e_data);
		foreach exposure in array exposure_arr 
		loop
			raise notice 'in loop';
			select nullif(trim((exposure->'id')::text,'"'),'null')::int4 into exposure_id;
			select trim(nullif((exposure->'exposureFirstName')::text,'null'),'"') into exposureFirstName;
			select trim(nullif((exposure->'exposureLastName')::text,'null'),'"') into exposureLastName;
			select nullif((exposure->'exposureDate')::text,'null')::timestamp into exposureDate;
			select trim(nullif((exposure->'exposureAddress')::text,'null'),'"') into exposureAddress;
			select nullif(trim((exposure->'exposurePlaceSubType')::text,'"'),'null')::int4 into exposurePlaceSubType;
			select trim(nullif((exposure->'exposurePlaceType')::text,'null'),'"') into exposurePlaceType;
			select trim(nullif((exposure->'flightDestinationCity')::text,'null'),'"') into flightDestinationCity;
			select trim(nullif((exposure->'flightDestinationAirport')::text,'null'),'"') into flightDestinationAirport;
			select trim(nullif((exposure->'flightOriginCity')::text,'null'),'"') into flightOriginCity;
			select trim(nullif((exposure->'flightOriginAirport')::text,'null'),'"') into flightOriginAirport;
			select nullif((exposure->'flightStartDate')::text,'null')::timestamp into flightStartDate;
			select nullif((exposure->'flightEndDate')::text,'null')::timestamp into flightEndDate;
			select trim(nullif((exposure->'airline')::text,'null'),'"') into pAirLine;
			select trim(nullif((exposure->'flightNum')::text,'null'),'"') into flightNum;
			select trim(nullif((exposure->'flightOriginCountry')::text,'null'),'"') into flightOriginCountry;
			select trim(nullif((exposure->'flightDestinationCountry')::text,'null'),'"') into flightDestinationCountry;
			select nullif((exposure->'wasAbroad')::text,'null')::bool into wasAbroad;
			select nullif((exposure->'wasConfirmedExposure')::text,'null')::bool into wasConfirmedExposure;

		
		if exposure_id is null then
				raise notice 'this is INSERT';
			INSERT INTO public.exposure(investigation_id, was_confirmed_exposure, exposure_first_name, exposure_last_name, 
				was_abroad, flight_start_date, airline, flight_num, exposure_place_name, exposure_place_type, 
				exposure_date, flight_end_date, exposure_address, exposure_place_sub_type, flight_origin_country, flight_origin_city, flight_origin_airport, flight_destination_country, flight_destination_city, flight_destination_airport)
				VALUES(investigationId, wasConfirmedExposure, exposureFirstName,exposureLastName, wasAbroad,
				flightStartDate, pAirLine, flightNum, exposurePlaceName,exposurePlaceType, exposureDate , flightEndDate, exposureAddress, exposurePlaceSubType, flightOriginCountry, flightOriginCity, flightOriginAirport, flightDestinationCountry, flightDestinationCity, flightDestinationAirport);
			else
				raise notice 'this is UPDATE %',exposure_id;
				UPDATE public.exposure
				SET investigation_id=investigationId, was_confirmed_exposure=wasConfirmedExposure, exposure_first_name=exposureFirstName, 
				exposure_last_name=exposureLastName, was_abroad=wasAbroad, flight_start_date=flightStartDate, airline=pAirLine, flight_num=flightNum, 
				exposure_place_name=exposurePlaceName, exposure_place_type=exposurePlaceType, exposure_date=exposureDate, flight_end_date=flightEndDate, 
				exposure_address=exposureAddress, exposure_place_sub_type=exposurePlaceSubType, flight_origin_country=flightOriginCountry, 
				flight_origin_city=flightOriginCity, flight_origin_airport=flightOriginAirport, flight_destination_country=flightDestinationCountry, 
				flight_destination_city=flightDestinationCity, flight_destination_airport=flightDestinationAirport
				WHERE id=exposure_id;

			
			end if;
		end loop;
	end if;
end;
$function$
;
