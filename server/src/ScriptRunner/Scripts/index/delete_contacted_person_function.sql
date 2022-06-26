-- FUNCTION: public.delete_contacted_person_function(integer, integer, integer)

-- DROP FUNCTION public.delete_contacted_person_function(integer, integer, integer);

CREATE OR REPLACE FUNCTION public.delete_contacted_person_function(
	contacted_person_id integer,
	involved_contact_id integer,
	investigation_id integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE 
updateInvestigationContactFromAboard boolean = false;
BEGIN	

	if exists (select * from contacted_person
			   	inner join person_contact_details 
			    on contacted_person.person_info = person_contact_details.person_info
			   	where contacted_person.id = contacted_person_id and  person_contact_details.is_stay_another_country = true ) then
		updateInvestigationContactFromAboard:=true;
	end if;
	
    -- I'm leaving this as a function in case einat changes her mind about deletion :P
	DELETE FROM public.contacted_person
   	WHERE id = contacted_person_id;
	
	if (updateInvestigationContactFromAboard = true) then
		PERFORM public.update_investigation_contact_from_aboard(investigation_id);
	end if;		
								
END;
$BODY$;