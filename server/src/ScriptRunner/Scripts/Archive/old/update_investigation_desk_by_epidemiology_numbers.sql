CREATE OR REPLACE FUNCTION public.update_investigation_desk_by_epidemiology_numbers(IN updated_desk integer,IN epidemiology_numbers integer[],IN reason character varying DEFAULT ''::character varying)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
BEGIN
    UPDATE public.investigation SET desk_id = updated_desk , transfer_reason = reason
    WHERE epidemiology_number IN (SELECT unnest(epidemiology_numbers));
END;
$BODY$;