CREATE OR REPLACE FUNCTION public.delete_contacted_person_function(
	contacted_person_id integer,
	involved_contact_id integer,
	investigation_id integer
	)
    RETURNS void
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
begin			
	if (involved_contact_id is null) then
   		delete from public.person
   		where id = (select person_info
   				   from public.contacted_person
   				   where id = contacted_person_id);
	else
 		update public.involved_contact
   		set contact_type = 3,
   		is_contacted_person = false
   		where id = involved_contact_id;

   		update public.investigation_settings
   		set allow_uncontacted_family = false
   		where epidemiology_number = investigation_id;
	end if;
	
	delete from public.contacted_person
   	where id = contacted_person_id;
							
END;
$BODY$;