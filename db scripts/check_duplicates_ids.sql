-- FUNCTION: public.check_duplicates_ids(character varying, integer)

-- DROP FUNCTION public.check_duplicates_ids(character varying, integer);

CREATE OR REPLACE FUNCTION public.check_duplicates_ids(
	curridentificationnumber character varying,
	investigationid integer,
	interactedcontactid integer)
    RETURNS boolean
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
AS $BODY$
declare
	foundDuplicates boolean = false;
	begin
			if exists(select 1
	from person p
				join contacted_person cp on p.id = cp.person_info join contact_event ce on ce.id = cp.contact_event
				where ce.investigation_id = investigationId and  p.identification_number is not null
				and p.identification_number = currIdentificationNumber
				and p.id <> interactedcontactid
			) then
				foundDuplicates = true;
			else
				foundduplicates = false;
			end if;
	return foundDuplicates;
	END;
$BODY$;

ALTER FUNCTION public.check_duplicates_ids(character varying, integer, integer)
    OWNER TO coronai;