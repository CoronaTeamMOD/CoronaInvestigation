-- FUNCTION: public.update_personal_details(json)

-- DROP FUNCTION public.update_personal_details(json);

CREATE OR REPLACE FUNCTION public.update_personal_details(
	personal_details json)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare

investigated_patient_id int4;
address json;
phoneNumber varchar;
additionalPhoneNumber varchar;
contactPhoneNumber varchar;
contactInfo varchar;
insuranceCompany varchar;
relevantOccupation varchar;
educationOccupationCity varchar;
institutionName varchar;
otherOccupationExtraInfo varchar;
occupationRole int4;
educationGrade int4;
educationClassNumber int4;
epidemiologyNumber int4;
addressCity varchar;
addressStreet varchar;
addressHouseNum varchar;
addressApartment varchar;
addressId int4;


begin 
	
	select trim(nullif((personal_details->'id')::text,'null'),'"')::int4 into investigated_patient_id;
	select trim(nullif((personal_details->'address')::text,'null'),'"')::json into address;
	select trim(nullif((personal_details->'phoneNumber')::text,'null'),'"') into phoneNumber;
	select trim(nullif((personal_details->'additionalPhoneNumber')::text,'null'),'"') into additionalPhoneNumber;
	select trim(nullif((personal_details->'contactPhoneNumber')::text,'null'),'"')  into contactPhoneNumber;
	select trim(replace(nullif((personal_details->'contactInfo')::text,'null'),'\"','"'),'"') into contactInfo;
	select trim(replace(nullif((personal_details->'insuranceCompany')::text,'null'),'\"','"'),'"') into insuranceCompany;
	select trim(nullif((personal_details->'relevantOccupation')::text,'null'),'"') into relevantOccupation;  
 	select trim(nullif((personal_details->'educationOccupationCity')::text,'null'),'"') into educationOccupationCity;
	select trim(replace(nullif((personal_details->'institutionName')::text,'null'),'\"','"'),'"') into institutionName;
	select trim(replace(nullif((personal_details->'otherOccupationExtraInfo')::text,'null'),'\"','"'),'"') into otherOccupationExtraInfo;
	select trim(nullif((personal_details->'educationGrade')::text,'null'),'"')::int4 into educationGrade;
	select trim(nullif((personal_details->'role')::text,'null'),'"')::int4 into occupationRole;
	select trim(nullif((personal_details->'educationClassNumber')::text,'null'),'"')::int4 into educationClassNumber;
	select trim(nullif((personal_details->'epidemiologyNumber')::text,'null'),'"')::int4 into epidemiologyNumber;
	    
--- create address

	select trim(nullif((address->'city')::text,'null'),'"') into addressCity;
	select trim(nullif((address->'street')::text,'null'),'"') into addressStreet;
	select trim(nullif((address->'houseNum')::text,'null'),'"') into addressHouseNum;
	select trim(nullif((address->'apartment')::text,'null'),'"') into addressApartment;
	

	insert into public.address (city, street, house_num, apartment) 
		values (
			trim(addressCity,'"'), 
			trim(addressStreet,'"'), 
			trim(addressHouseNum,'"'), 
			trim(addressApartment,'"')
		);
	
	addressId := currval('address_id_seq');

-- update investigated patient

	update public.investigated_patient
	set hmo = insuranceCompany,
	other_occupation_extra_info = otherOccupationExtraInfo,
	occupation = relevantOccupation,
	sub_occupation = institutionName,
	patient_contact_info = contactInfo,
	additional_phone_number = additionalPhoneNumber,
	patient_contact_phone_number = contactPhoneNumber,
	role = occupationRole,
	education_grade = educationGrade,
	education_class_number = educationClassNumber
	where id = investigated_patient_id;
	
	
-- update covid patient
	
	update public.covid_patients
	set primary_phone = phoneNumber,
	address = addressId
	where epidemiology_number = epidemiologyNumber;
	
-- calucate complexity

	perform public.calc_investigation_complexity(epidemiologyNumber);
		
	
	
end;
$BODY$;

