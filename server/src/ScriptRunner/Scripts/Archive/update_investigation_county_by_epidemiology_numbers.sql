CREATE OR REPLACE FUNCTION public.update_investigation_county_by_epidemiology_numbers(IN new_investigator character varying,IN last_updator character varying,IN updated_desk integer,IN investigation_transferred boolean,IN reason character varying,IN epidemiology_numbers integer[])
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
BEGIN
    UPDATE public.investigation SET creator = new_investigator , last_updator =  new_investigator , desk_id = updated_desk , was_investigation_transferred = investigation_transferred , transfer_reason = reason
    WHERE epidemiology_number IN (SELECT unnest(epidemiology_numbers));
END;
$BODY$;