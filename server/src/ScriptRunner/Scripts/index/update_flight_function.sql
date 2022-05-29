CREATE OR REPLACE FUNCTION public.update_flight_function(
	input_flight json,
    exposure_id int4)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

declare
flight_id integer;
actionFlag varchar;
flightStartDate timestamp;
airLine varchar;
flightNum varchar ;
flightEndDate timestamp;
flightOriginCountry varchar;
flightOriginAirport varchar;
flightDestinationCountry varchar;
flightDestinationAirport varchar;
otherFlightNum varchar;
--flightSeatNum varchar;
otherAirline varchar;
creationSource int4;


begin
	select nullif(trim((input_flight->'id')::text,'"'),'null')::int4 into flight_id;
	select trim(nullif((input_flight->'flightDestinationAirport')::text,'null'),'"') into flightDestinationAirport;
	select trim(nullif((exposure->'flightOriginAirport')::text,'null'),'"') into flightOriginAirport;
	select nullif((exposure->'flightStartDate')::text,'null')::timestamp into flightStartDate;
	select nullif((exposure->'flightEndDate')::text,'null')::timestamp into flightEndDate;
	select trim(nullif((exposure->'airline')::text,'null'),'"') into airline;
	select trim(nullif((exposure->'flightNum')::text,'null'),'"') into flightNum;
	select trim(nullif((exposure->'flightOriginCountry')::text,'null'),'"') into flightOriginCountry;
	select trim(nullif((exposure->'flightDestinationCountry')::text,'null'),'"') into flightDestinationCountry;
	select trim(nullif((exposure->'otherFlightNum')::text,'null'),'"') into otherFlightNum;
	--select trim(nullif((exposure->'flightSeatNum')::text,'null'),'"') into flightSeatNum;
	select trim(nullif((exposure->'otherAirline')::text,'null'),'"') into otherAirline;
	select trim(nullif((exposure->'actionFlag')::text,'null'),'"') into actionFlag;
	select nullif(trim((input_flight->'creationSource')::text,'"'),'null')::int4 into creationSource;
	
		if actionFlag='D' and flight_id is not null then
			delete from public.flights
			where  flight_id = id;
		else if flight_id is null then
			INSERT INTO public.flights(
				exposure_id, 
				flight_start_date, 
				flight_end_date, 
				flight_num, 
				other_flight_num, 
				airline_id, 
				other_airline, 
				flight_origin_country,
				flight_origin_airport, 
				flight_destination_country, 
				flight_destination_airport,
				creation_source)
			VALUES (exposure_id,
					flightStartDate, 
					flightEndDate, 
					flightNum, 
					otherFlightNum,
					airline, 
					otherAirline, 
					flightOriginCountry,
					flightOriginAirport, 
					flightDestinationCountry, 
					flightDestinationAirport, 
				    creationSource);
			else
				UPDATE public.flights
				SET  
					flight_start_date=flightStartDate, 
					airline_id=airline, 
					flight_num=flightNum, 
					flight_end_date=flightEndDate, 
					flight_origin_country=flightOriginCountry, 
					flight_origin_airport=flightOriginAirport, 
					flight_destination_country=flightDestinationCountry, 
					flight_destination_airport=flightDestinationAirport,
					other_flight_num = otherFlightNum,
					other_airline = otherAirline,
					creation_source = creationSource
				WHERE id=flight_id;

			
			end if;
		
	end if;

end;
$BODY$;

