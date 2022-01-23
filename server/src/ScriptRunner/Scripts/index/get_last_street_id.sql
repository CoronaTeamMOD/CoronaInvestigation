-- FUNCTION: public.get_last_street_id()

 DROP FUNCTION public.get_last_street_id();

CREATE OR REPLACE FUNCTION public.get_last_street_id(
	)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
res VARCHAR;
begin

SELECT id FROM public.streets
ORDER BY id::int4 desc limit 1 into res ;
return res;
end;
$BODY$;

ALTER FUNCTION public.get_last_street_id()
    OWNER TO coronai;
