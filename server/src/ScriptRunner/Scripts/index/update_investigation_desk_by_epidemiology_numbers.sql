-- FUNCTION: public.update_investigation_desk_by_epidemiology_numbers(integer, integer[], character varying)

-- DROP FUNCTION IF EXISTS public.update_investigation_desk_by_epidemiology_numbers(integer, integer[], character varying);

CREATE OR REPLACE FUNCTION public.update_investigation_desk_by_epidemiology_numbers(
	updated_desk integer,
	epidemiology_numbers integer[],
	reason character varying DEFAULT ''::character varying,
	reason_id integer DEFAULT null)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    UPDATE public.investigation SET desk_id = updated_desk , transfer_reason = reason, transfer_reason_id = reason_id
    WHERE epidemiology_number IN (SELECT unnest(epidemiology_numbers));
END;
$BODY$;


