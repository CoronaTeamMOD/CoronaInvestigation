-- FUNCTION: public.duplicate_person_by_id()

-- DROP FUNCTION public.duplicate_person_by_id(personId bigint);

CREATE OR REPLACE FUNCTION public.duplicate_person_by_id(
	personId bigint
	)
    RETURNS bigint
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE 
	new_person_id bigint;
BEGIN
	INSERT INTO public.person (
		first_name,
		last_name,
		identification_type,
		identification_number,
		phone_number,
		additional_phone_number,
		gender,
		birth_date
	) SELECT 
		first_name,
		last_name,
		identification_type,
		identification_number,
		phone_number,
		additional_phone_number,
		gender,
		birth_date
	FROM public.person
	WHERE id = personId
	RETURNING id INTO new_person_id;
	RETURN new_person_id;
END
$BODY$;

ALTER FUNCTION public.duplicate_person_by_id(personId bigint)
    OWNER TO coronai;
