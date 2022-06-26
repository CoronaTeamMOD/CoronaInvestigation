-- FUNCTION: public.update_investigation_contact_from_aboard(integer)

-- DROP FUNCTION public.update_investigation_contact_from_aboard(integer);

CREATE OR REPLACE FUNCTION public.update_investigation_contact_from_aboard(
	epidemiology_number_value integer)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
  countOfContactsFromAboard int;
  contactFromAboardId int;
  complexityCode int;
  complexityReasons int[];
BEGIN 
	
	select contact_from_aboard_id, complexity_code, complexity_reasons_id  		 
	into contactFromAboardId, complexityCode, complexityReasons
	from public.investigation
	where epidemiology_number = epidemiology_number_value;
	
	if exists (
		select contact.id
		from contact_event evnt
		inner join contacted_person contact
		on (evnt.id = contact.contact_event)
		inner join person_contact_details contact_details
		on (contact.person_info = contact_details.person_info)	
		where investigation_id = epidemiology_number_value and contact_details.is_stay_another_country = true   
	) then
		if (contactFromAboardId <> 2) then
			update investigation
			set contact_from_aboard_id = 2,
			complexity_code = 1,
			complexity_reasons_id = case when 14 = ANY(complexityReasons) then complexityReasons else array_append(complexityReasons, 14) end
			where epidemiology_number = epidemiology_number_value;
		end if;
	
	else
		if (contactFromAboardId <> 0) then
			update investigation
			set contact_from_aboard_id =0,
			complexity_code = case when complexityCode = 1 and  array_length(complexityReasons,1)=1 and 14 = ANY(complexityReasons) then 2 else complexity_code end, 
			complexity_reasons_id = case when 14 = ANY(complexityReasons) then array_remove(complexityReasons, 14)  else complexity_reasons_id end
			where epidemiology_number = epidemiology_number_value;
		end if;
	
	end if;
	

END;
$BODY$;


