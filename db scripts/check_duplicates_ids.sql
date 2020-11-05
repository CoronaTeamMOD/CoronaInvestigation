CREATE OR REPLACE FUNCTION public.check_duplicates_ids(curridentificationnumber character varying, investigationid integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
	foundDuplicates boolean = false;
	begin
			if exists(select p.identification_number, count(*)
				from person p
				join contacted_person cp on p.id = cp.person_info join contact_event ce on ce.id = cp.contact_event
				where ce.investigation_id = investigationId
					and p.identification_number = currIdentificationNumber
					and p.identification_number is not null
				group by p.identification_number
				having count(p.identification_number) > 1
			) then
				foundDuplicates = true;
			else
				foundduplicates = false;
			end if;
	return foundDuplicates;
	END;
$function$
;