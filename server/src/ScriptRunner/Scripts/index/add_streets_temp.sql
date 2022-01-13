-- FUNCTION: public.add_streets_temp(json)

DROP FUNCTION public.add_streets_temp(json);

CREATE OR REPLACE FUNCTION public.add_streets_temp(
	streets json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
	streets_arr json[];
	street json;
	id_input int4;
	display_name_input varchar; 
	city_input varchar; 
	mho_code_input varchar;
	city_code varchar;
begin 

	streets_arr :=(
		select array_agg(streets_data)
		from json_array_elements (streets->'streets') streets_data
	);
	foreach street in array streets_arr
	loop
		select trim(nullif((street->'id')::text,'"'))::int4 into id_input;
		select trim(nullif((street->'display_name')::text,'null'),'"') into display_name_input;
		select trim(nullif((street->'city')::text,'null'),'"') into city_code;
		select trim(nullif((street->'mho_code')::text,'null'),'"') into mho_code_input;
		
		select into city_input
		id
		from public.cities
		where id = city_code;

		INSERT INTO public.streets_temp(
		id, display_name, city, mho_code)
		VALUES (id_input, display_name_input, city_input, mho_code_input)
		ON CONFLICT (display_name,city,mho_code) DO NOTHING;
	end loop;
end;
$BODY$;

ALTER FUNCTION public.add_streets_temp(json)
    OWNER TO coronai;
