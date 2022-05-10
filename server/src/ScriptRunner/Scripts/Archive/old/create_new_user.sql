-- FUNCTION: public.create_new_user(character varying, character varying[], character varying, character varying, integer, character varying, character varying, character varying, character varying)

-- DROP FUNCTION public.create_new_user(character varying, character varying[], character varying, character varying, integer, character varying, character varying, character varying, character varying);

CREATE OR REPLACE FUNCTION public.create_new_user(
	id character varying,
	languages character varying[],
	city character varying,
	full_name character varying,
	investigation_group integer,
	mail character varying,
	phone_number character varying,
	source_organization character varying,
	identity_number character varying)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
DECLARE language character varying;
BEGIN

	INSERT INTO public."user"(
	user_name, identity_number, id, phone_number, investigation_group, is_active, source_organization, full_name, city, mail,user_type)
	VALUES (full_name, identity_number, id, phone_number, investigation_group, false, source_organization, full_name, city, mail,1);
	
	IF array_length(languages, 1) > 0 THEN
		FOREACH language IN ARRAY languages
		LOOP
			INSERT INTO public.user_languages
			(user_id, "language")
			VALUES (id, language);
		END LOOP;
	END IF;
END;
$BODY$;

ALTER FUNCTION public.create_new_user(character varying, character varying[], character varying, character varying, integer, character varying, character varying, character varying, character varying)
    OWNER TO coronai;
