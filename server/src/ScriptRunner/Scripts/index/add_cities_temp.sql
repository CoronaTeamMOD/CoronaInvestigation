CREATE OR REPLACE FUNCTION public.add_cities_temp(
	IN sync_cities json)
    RETURNS void
    LANGUAGE 'plpgsql'
	COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	cities_arr json[];
	city json;
	inputId varchar;
	displayName varchar; 

begin 

	cities_arr :=(
		select array_agg(cities_data)
		from json_array_elements (sync_cities->'sync_cities') cities_data
	);
	foreach city in array cities_arr
	loop
		select trim(nullif((street->'id')::text,'"')) into inputId;
		select trim(nullif((street->'display_name')::text,'null')) into displayName;

		INSERT INTO public.cities_temp (id, display_name, desk_mapping_technique)
		VALUES (inputId, displayName, 1);
	end loop;
end;
$BODY$;

-- CREATE OR REPLACE FUNCTION public.add_cities_temp(IN cities json)
--     RETURNS void
--     LANGUAGE 'plpgsql'

-- AS $BODY$

-- declare
-- city json;
-- id_input varchar;
-- display_name_input varchar;

-- begin 
-- 	DELETE FROM public.cities_temp;
	
-- 	foreach city in array cities 
-- 	loop
--         select trim(nullif((city->'id_input')::text,'null'),'"') into id_input;
--  		select trim(nullif((city->'display_name_input')::text,'null'),'"') into display_name_input;

-- 		INSERT INTO public.cities_temp (id, display_name, desk_mapping_technique)
-- 	    VALUES (id_input, display_name_input, 1)
-- 	    ON CONFLICT DO NOTHING;
			
-- 	end loop;
-- end;
-- $BODY$;