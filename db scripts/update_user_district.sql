-- FUNCTION: public.update_user_district(varchar, integer)

--DROP FUNCTION public.update_user_district(varchar, integer);

CREATE OR REPLACE FUNCTION public.update_user_district(
	user_id_input varchar,
	district_id_input integer)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
--Update user county by district
county_id integer;
county_display_name varchar;

begin 
	SELECT id, display_name INTO county_id, county_display_name FROM public.counties
	WHERE district_id = district_id_input
		AND is_displayed = true
	ORDER BY display_name ASC
	LIMIT 1;
	
	UPDATE public.user
	SET investigation_group=county_id
	WHERE id = user_id_input;
	
	-- returning a json object
	return json_build_object(
		'countyId',county_id,
		'countyDisplayName',county_display_name
	);
end;
$BODY$;

ALTER FUNCTION public.update_user_district(varchar, integer)
    OWNER TO postgres;

COMMENT ON FUNCTION public.update_user_district(varchar, integer)
    IS 'Update user county by district';