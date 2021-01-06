CREATE OR REPLACE FUNCTION public.get_investigator_list_by_county_function(input_county_id integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$declare
res json;
begin

 SELECT JSON_AGG(src) as src
from (
select 			  id,
				  is_active as isActive,
				  user_name as userName,
				  phone_number as phoneNumber ,
				  investigation_group as investigationGroup,
				  serial_number as serialNumber,
				  user_type as userType,
				  source_organization as sourceOrganization,
				  desk_id as deskId, 
				  desk_name as deskName,
				  newInvestigationsCount,
				  activeInvestigationsCount,
				  pauseInvestigationsCount,
			      array_agg(distinct ul.language) as  languages
from (
		select u.id ,
	   u.is_active ,
       u.user_name ,
       u.phone_number ,
       u.investigation_group ,
       u.serial_number,
       u.user_type,
       u.source_organization,
       u.desk_id, 
       d.desk_name,
       sum( case when i.investigation_status = 1 then 1 else 0 end)    as newInvestigationsCount,
	   sum( case when i.investigation_status = 100000002 then 1 else 0 end) as activeInvestigationsCount,
	   sum( case when i.investigation_status = 100000002 and investigation_sub_status is not null  then 1 else 0 end) as pauseInvestigationsCount 	
	   from   public."user" u 
		 	  left join desks d  on u.desk_id = d.id 	
			  left join investigation i on u.id  = i.creator  
	  where  u.is_active =true and u.investigation_group = input_county_id
	 group by u.id ,
	   u.is_active ,
       u.user_name ,
       u.phone_number ,
       u.investigation_group ,
       u.serial_number ,
       u.user_type ,
       u.source_organization ,
       u.desk_id , 
       d.desk_name
	 ) as innerTable left join user_languages ul  on innerTable.id  = ul.user_id
group by 
				  id,
				  is_active,
				  user_name,
				  phone_number,
				  investigation_group,
				  serial_number,
				  user_type,
				  source_organization,
				  desk_id, 
				  desk_name,
				  newInvestigationsCount,
				  activeInvestigationsCount,
				  pauseInvestigationsCount
) src into res ;
return res;
end;
$function$
;
