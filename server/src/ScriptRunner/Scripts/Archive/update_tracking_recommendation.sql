-- FUNCTION: public.update_tracking_recommendation(integer, integer, integer, text)

-- DROP FUNCTION public.update_tracking_recommendation(integer, integer, integer, text);

CREATE OR REPLACE FUNCTION public.update_tracking_recommendation(
	input_epidemiology_number integer,
	reason integer,
	sub_reason integer,
	extra_info text)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE language character varying;
BEGIN
	IF reason IS NULL
	THEN 
		UPDATE public.investigation 
		SET tracking_sub_reason = NULL, 
			tracking_extra_info = NULL
		WHERE investigation.epidemiology_number = input_epidemiology_number;
	ELSE
		UPDATE public.investigation 
		SET tracking_sub_reason = (
				SELECT id FROM public.tracking_sub_reasons
				WHERE reason_id = reason AND sub_reason_id = sub_reason
			), tracking_extra_info = extra_info
		WHERE investigation.epidemiology_number = input_epidemiology_number;
		
	END IF;	
END;
$BODY$;

ALTER FUNCTION public.update_tracking_recommendation(integer, integer, integer, text)
    OWNER TO coronai;
