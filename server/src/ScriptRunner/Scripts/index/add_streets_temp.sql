CREATE OR REPLACE FUNCTION public.add_streets_temp(
	IN sync_streets json)
    RETURNS void
    LANGUAGE 'plpgsql'
	COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	streets_arr json[];
	street json;
	inputId varchar;
	displayName varchar; 
	inputCity varchar; 
	inputMhoCode varchar;

begin 

	streets_arr :=(
		select array_agg(streets_data)
		from json_array_elements (sync_streets->'sync_streets') streets_data
	);
	foreach street in array streets_arr
	loop
		select trim(nullif((street->'id')::text,'"')) into inputId;
		select trim(nullif((street->'display_name')::text,'null')) into displayName;
		select trim(nullif((street->'city')::text,'null')) into inputCity;
		select trim(nullif((street->'mho_code')::text,'null')) into inputMhoCode;

		INSERT INTO public.streets_temp(
		id, display_name, city, mho_code, desk_id)
		VALUES (inputId, displayName, inputCity, mhoCode, null);
	end loop;
end;
$BODY$;