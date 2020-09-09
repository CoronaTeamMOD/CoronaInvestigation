CREATE OR REPLACE FUNCTION public.insert_person_and_get_id(contacted_first_name character varying, contacted_last_name character varying, contacted_id_type character varying, contacted_id_number character varying, contacted_phone_number character varying, contacted_phone_number_extra character varying, contacted_gender character varying, contacted_birth_date timestamp with time zone)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
	person_id integer;
BEGIN
	SELECT INTO person_id
	id
	FROM person
	WHERE identification_type=contacted_id_type AND
	identification_number=contacted_id_number;
	IF person_id IS NULL THEN
		INSERT INTO person(first_name,
							last_name,
							identification_type,
							identification_number,
							phone_number,
							additional_phone_number,
							gender,
							birth_date)
		VALUES(contacted_first_name,
		    contacted_last_name,
		    contacted_id_type,
		    contacted_id_number,
		    contacted_phone_number,
		    contacted_phone_number_extra,
		    contacted_gender,
		    contacted_birth_date)
		RETURNING id INTO person_id;
	END IF;
	RETURN person_id;
END;
$function$
;