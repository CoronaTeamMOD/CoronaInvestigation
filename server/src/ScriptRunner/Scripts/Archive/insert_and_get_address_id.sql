-- FUNCTION: public.insert_and_get_address_id(character varying, character varying, character varying, character varying, character varying, character varying, character varying)

-- DROP FUNCTION public.insert_and_get_address_id(character varying, character varying, character varying, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.insert_and_get_address_id(
	city_value character varying,
	neighbourhood_value character varying,
	street_value character varying,
	house_num_value character varying,
	apartment_value character varying,
	entrance_value character varying,
	floor_value character varying)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE
	address_id integer;
BEGIN

	raise notice 'apartment_value: %', apartment_value;

	SELECT id INTO address_id
	FROM address
	WHERE (city=city_value OR (city IS null AND city_value IS null)) AND
	(street=street_value OR (street IS null AND street_value IS null)) AND
	(house_num=house_num_value OR (house_num IS null AND house_num_value IS null)) AND
	(floor=floor_value OR (floor IS null AND floor_value IS null)) AND
	(apartment=apartment_value OR (apartment IS null AND apartment_value IS null));
	
	raise notice 'selected address id: %', address_id;
	
	IF address_id IS NULL THEN
		INSERT INTO address(city,
						   	neighbourhood,
						   	street,
						   	house_num,
						   	apartment,
						   	entrance,
						   	floor)
		VALUES(city_value,
				neighbourhood_value,
				street_value,
				house_num_value,
				apartment_value,
				entrance_value,
				floor_value)
		RETURNING id INTO address_id;
	END IF;

	RETURN address_id;
END;
$BODY$;

ALTER FUNCTION public.insert_and_get_address_id(character varying, character varying, character varying, character varying, character varying, character varying, character varying)
    OWNER TO coronai;
