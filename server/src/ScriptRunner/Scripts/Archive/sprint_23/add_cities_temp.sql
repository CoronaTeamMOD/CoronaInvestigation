CREATE OR REPLACE FUNCTION public.add_cities_temp(IN cities json)
    RETURNS void
    LANGUAGE 'plpgsql'

AS $BODY$

declare
city json;
id_input varchar;
display_name_input varchar;

begin 
	DELETE FROM public.cities_temp;
	
	foreach city in array cities 
	loop
        select trim(nullif((city->'id_input')::text,'null'),'"') into id_input;
 		select trim(nullif((city->'display_name_input')::text,'null'),'"') into display_name_input;

		INSERT INTO public.cities_temp (id, display_name, desk_mapping_technique)
	    VALUES (id_input, display_name_input, 1)
	    ON CONFLICT DO NOTHING;
			
	end loop;
end;
$BODY$;





-- [
--   { id: '0', displayName: 'לא רשום' },
--   { id: '5', displayName: 'יזרעם' },
--   { id: '7', displayName: 'שחר' },
--   { id: '10', displayName: 'תירוש' }
-- ]