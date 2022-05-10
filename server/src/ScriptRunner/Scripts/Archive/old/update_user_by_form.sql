CREATE OR REPLACE FUNCTION public.update_user_by_form(IN id_input character varying,IN languages_input character varying[],IN city_input character varying,IN desk_input integer,IN investigation_group_input integer,IN mail_input character varying,IN phone_number_input character varying,IN source_organization_input character varying,IN authority_input integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
DECLARE language character varying;
BEGIN

	UPDATE public."user"
	SET phone_number = phone_number_input, investigation_group = investigation_group_input, source_organization = source_organization_input, city = city_input, mail = mail_input, desk_id = desk_input, authority_id = authority_input
	WHERE id = id_input;

	DELETE FROM public."user_languages" 
	WHERE user_id = id_input;
	
	IF array_length(languages_input, 1) > 0 THEN
		FOREACH language IN ARRAY languages_input
		LOOP
			INSERT INTO public."user_languages"
			(user_id, "language")
			VALUES (id_input, language);
		END LOOP;
	END IF;
END;
$BODY$;