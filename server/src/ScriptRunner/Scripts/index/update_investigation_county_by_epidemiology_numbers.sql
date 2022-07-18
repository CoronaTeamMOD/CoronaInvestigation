-- FUNCTION: public.update_investigation_county_by_epidemiology_numbers(character varying, character varying, integer, boolean, character varying, integer[])

-- DROP FUNCTION IF EXISTS public.update_investigation_county_by_epidemiology_numbers(character varying, character varying, integer, boolean, character varying, integer[]);

CREATE OR REPLACE FUNCTION public.update_investigation_county_by_epidemiology_numbers(
	new_investigator character varying,
	last_updator character varying,
	updated_desk integer,
	investigation_transferred boolean,
	reason character varying,
	epidemiology_numbers integer[],
	reason_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
BEGIN
    UPDATE public.investigation SET creator = new_investigator , last_updator =  new_investigator , desk_id = updated_desk , was_investigation_transferred = investigation_transferred , transfer_reason = reason, transfer_reason_id = reason_id
    WHERE epidemiology_number IN (SELECT unnest(epidemiology_numbers));
END;
$BODY$;