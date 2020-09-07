-- FUNCTION: public.insert_and_get_address_id(character varying, character varying, character varying, integer, integer, character varying, integer)

-- DROP FUNCTION public.insert_and_get_address_id(character varying, character varying, character varying, integer, integer, character varying, integer);

CREATE OR REPLACE FUNCTION public.insert_and_get_address_id(
	city_value character varying,
	neighbourhood_value character varying,
	street_value character varying,
	house_num_value integer,
	apartment_value integer,
	entrance_value character varying,
	floor_value integer)
    RETURNS integer
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE
	address_id integer;
BEGIN
	SELECT INTO address_id
	id
	FROM address
	WHERE city=city_value AND
	neighbourhood=neighbourhood_value AND
	street=street_value AND
	house_num=house_num_value AND
	apartment=apartment_value AND
	entrance=entrance_value AND
	floor=floor_value;
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

ALTER FUNCTION public.insert_and_get_address_id(character varying, character varying, character varying, integer, integer, character varying, integer)
    OWNER TO coronai;


-- FUNCTION: public.insert_background_deseases(integer, character varying[])

-- DROP FUNCTION public.insert_background_deseases(integer, character varying[]);

CREATE OR REPLACE FUNCTION public.insert_background_deseases(
	investigated_patient_id integer,
	background_deseases character varying[])
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE background_deseas char varying;
BEGIN
	FOREACH background_deseas IN ARRAY background_deseases
	LOOP
		INSERT INTO investigated_patient_background_diseases
		(investigated_patient_id, background_deseas_name)
		VALUES (investigated_patient_id, background_deseas);
	END LOOP;
END;
$BODY$;

ALTER FUNCTION public.insert_background_deseases(integer, character varying[])
    OWNER TO coronai;

-- FUNCTION: public.insert_symptoms(integer, character varying[])

-- DROP FUNCTION public.insert_symptoms(integer, character varying[]);

CREATE OR REPLACE FUNCTION public.insert_symptoms(
	investigation_id_value integer,
	symptom_names character varying[])
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE symptom_name char varying;
BEGIN
	FOREACH symptom_name IN ARRAY symptom_names
	LOOP
		INSERT INTO investigated_patient_symptoms
		(investigation_id, symptom_name)
		VALUES (investigation_id_value, symptom_name);
	END LOOP;
END;
$BODY$;

ALTER FUNCTION public.insert_symptoms(integer, character varying[])
    OWNER TO coronai;
