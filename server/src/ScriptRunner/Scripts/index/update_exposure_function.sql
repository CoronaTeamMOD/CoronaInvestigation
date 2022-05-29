-- FUNCTION: public.update_exposure_function(json)

-- DROP FUNCTION public.update_exposure_function(json);

CREATE OR REPLACE FUNCTION public.update_exposure_function(
	input_exposures json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
exposureId int4;
investigationId int4;
wasAbroad bool;
wasConfirmedExposure bool;
wasInEvent bool;
wasInVacation bool;
borderCheckpointType int4;
borderCheckpoint varchar;
arrivalDateToIsrael timestamp;
arrivalTimeToIsrael timestamp;
lastDestinationCountry varchar;
wereConfirmedExposuresDesc varchar;
creationSource int4;

exposureDetailsArr json[];
flightsJson json;
flightsArr json[];
flight json;

begin	
	select nullif(trim((input_exposures->'investigationId')::text,'"'),'null')::int4 into investigationId;
	select nullif(trim((input_exposures->'id')::text,'"'),'null')::int4 into exposureId;
	select nullif((input_exposures->'wasAbroad')::text,'null')::bool into wasAbroad;
	select nullif((input_exposures->'wasConfirmedExposure')::text,'null')::bool into wasConfirmedExposure;
	select nullif((input_exposures->'borderCheckpointType')::text,'null')::int4 into borderCheckpointType;
	select trim(nullif((input_exposures->'borderCheckpoint')::text,'null'),'"') into borderCheckpoint;
	select nullif((input_exposures->'arrivalDateToIsrael')::text,'null')::timestamp into arrivalDateToIsrael;
	select trim(nullif((input_exposures->'arrivalTimeToIsrael')::text,'null'),'"')::timestamp into arrivalTimeToIsrael;
	select trim(nullif((input_exposures->'lastDestinationCountry')::text,'null'),'"') into lastDestinationCountry;
	select trim(nullif((input_exposures->'wereConfirmedExposuresDesc')::text,'null'),'"') into wereConfirmedExposuresDesc;
	select nullif((input_exposures->'wasInEvent')::text,'null')::bool into wasInEvent;	
	select nullif((input_exposures->'wasInVacation')::text,'null')::bool into wasInVacation;				
	select nullif(trim((input_exposures->'creationSource')::text),'null')::int4 into creationSource;
	select (input_exposures->'flights') into flightsJson;
		if exposureId is null then
		
			INSERT INTO public.exposure(investigation_id, was_confirmed_exposure, was_abroad,
				 border_checkpoint_type, border_checkpoint,
			 	last_destination_country, arrival_time_to_israel, arrival_date_to_israel,
				was_in_event, was_in_vacation,were_confirmed_exposures_desc, creation_source )
				VALUES(investigationId, wasConfirmedExposure, wasAbroad,
				borderCheckpointType, borderCheckpoint,
				lastDestinationCountry, arrivalTimeToIsrael::time, arrivalDateToIsrael,
				wasInEvent, wasInVacation, wereConfirmedExposuresDesc, creationSource);
				exposureId := currval('exposure_id_seq');
		else
				UPDATE public.exposure
				SET investigation_id=investigationId, 
				was_confirmed_exposure=wasConfirmedExposure, 
				was_abroad=wasAbroad,  
				border_checkpoint_type = borderCheckpointType, 
				border_checkpoint = borderCheckpoint, 
				last_destination_country = lastDestinationCountry,
				arrival_time_to_israel = arrivalTimeToIsrael::time, 
				arrival_date_to_israel = arrivalDateToIsrael,
				was_in_event = wasInEvent,
				was_in_vacation = wasInVacation,
				were_confirmed_exposures_desc = wereConfirmedExposuresDesc,
				creation_source = creationSource
				WHERE id=exposureId;

			
			end if;
			
			--flights
			if flightsJson is not null and flightsJson::TEXT != '[]' then
				flightsArr :=(select  array_agg(e_data.value) from json_array_elements(flightsJson) e_data);
				foreach flight in array flightsArr 
				loop
					perform public.update_flight_function(flight,exposureId);

				end loop;
			end if;



end;
$BODY$;

