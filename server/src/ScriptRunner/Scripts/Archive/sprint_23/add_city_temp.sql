CREATE OR REPLACE FUNCTION public.add_city_temp(
	id_input varchar, 
	display_name_input varchar, 
	desk_mapping_technique_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'

AS $BODY$

begin 
	-- DELETE FROM public.cities_temp;

	INSERT INTO public.cities_temp (id, display_name, desk_mapping_technique)
	VALUES (id_input, display_name_input, desk_mapping_technique_input)
	ON CONFLICT DO NOTHING;
end;
$BODY$;