CREATE OR REPLACE FUNCTION public.delete_investigation(IN delete_epi_number integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    VOLATILE
    PARALLEL UNSAFE
    COST 100
AS $BODY$
	
begin
	
UPDATE public.investigation
SET creator = 'admin.group9997'
WHERE epidemiology_number = delete_epi_number;

UPDATE public.investigation
SET investigation_status = 100000001
WHERE epidemiology_number = delete_epi_number;

end;
$BODY$;