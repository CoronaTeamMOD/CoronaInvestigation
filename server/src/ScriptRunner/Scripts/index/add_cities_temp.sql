-- FUNCTION: public.add_cities_temp(json)

DROP FUNCTION public.add_cities_temp(json);

CREATE OR REPLACE FUNCTION public.add_cities_temp(
	cities json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
cities_arr json[];
city json;
id_input varchar;
display_name_input varchar;
county_id_input int4;
county_id int4;

begin 	
	cities_arr :=(
					select array_agg(cities_data)
					from json_array_elements(cities->'cities') cities_data
				  );
				  
	foreach city in array cities_arr 
	loop
        select trim(nullif((city->'id')::text,'null'),'"') into id_input;
 		select trim(nullif((city->'display_name')::text,'null'),'"') into display_name_input;
		select trim(nullif((city->'county_id')::text,'null'),'"')::int4 into county_id;
		
		select into county_id_input
		id
		from public.counties
		where id = county_id;
		
		INSERT INTO public.cities_temp (id, display_name, county_id, desk_mapping_technique)
	    VALUES (id_input, display_name_input, county_id_input, 1)
	    ON CONFLICT (id) DO NOTHING;
			
	end loop;
end;
$BODY$;

ALTER FUNCTION public.add_cities_temp(json)
    OWNER TO coronai;
