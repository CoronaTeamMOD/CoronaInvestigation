CREATE OR REPLACE FUNCTION public.get_investigator_list_by_county_function(input_county_id integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$declare
res json;
begin

 SELECT JSON_AGG(src) as src
from (
select u.id ,
	   u.is_active as isActive,
       u.user_name as userName,
       u.phone_number as phoneNumber ,
       u.investigation_group as investigationGroup,
       u.serial_number as serialNumber,
       u.user_type as userType,
       u.source_organization as sourceOrganization,
       u.desk_id as deskId, 
       d.desk_name as deskName, 
       array_agg(distinct ul.language) as languages, 
	   sum( case when i.investigation_status = 1 then 1 else 0 end) as newInvestigationsCount,
	   sum( case when i.investigation_status = 100000002 then 1 else 0 end) as activeInvestigationsCount,
	   sum( case when i.investigation_status = 100000002 and investigation_sub_status is not null  then 1 else 0 end) as pauseInvestigationsCount 	
	   from   public."user" u 
		   left join investigation i on u.id  = i.creator  
		   left join user_languages ul on u.id = ul.user_id 
		   left join desks d  on u.desk_id = d.id 	
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
) src into res ;
return res;
end;
$function$
;
