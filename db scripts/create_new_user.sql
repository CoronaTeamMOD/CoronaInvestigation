CREATE OR REPLACE FUNCTION public.create_new_user(
	id character varying,
	languages character varying[],
	city character varying,
	full_name character varying,
	investigation_group integer,
	mail character varying,
	phone_number character varying,
	source_organization character varying,
	user_name character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE language character varying;
BEGIN

	INSERT INTO public."user"(
	user_name, id, phone_number, investigation_group, is_admin, is_active, source_organization, full_name, city, mail)
	VALUES (user_name, id, phone_number, investigation_group, false, false, source_organization, full_name, city, mail);
	
	FOREACH language IN ARRAY languages
	LOOP
		INSERT INTO public.user_languages
		(user_id, "language")
		VALUES (id, language);
	END LOOP;
END;
$BODY$;
