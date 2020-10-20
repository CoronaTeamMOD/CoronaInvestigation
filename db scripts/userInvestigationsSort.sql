-- FUNCTION: public.user_investigations_sort(character varying, character varying)

-- DROP FUNCTION public.user_investigations_sort(character varying, character varying);

CREATE OR REPLACE FUNCTION public.user_investigations_sort(
	user_id character varying,
	order_by character varying)
    RETURNS json
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$
BEGIN
RETURN (select
    json_build_object(
        'allInvestigations', json_agg(
            json_build_object(
                'epidemiologyNumber', investigationTable.epidemiology_number,
				'coronaTestDate', investigationTable.corona_test_date,
				'isComplex', investigationTable.complexity_code <> 2,
				'priority', investigationTable.priority,
				'investigatedPatientByInvestigatedPatientId', (
					select json_build_object (
						'covidPatientByCovidPatient', (
							select json_build_object (
								'age', (select EXTRACT(YEAR FROM (AGE(covidPatientTable.birth_date)))),
								'fullName', covidPatientTable.full_name,
								'primaryPhone', covidPatientTable.primary_phone,
								'addressByAddress', (
									select json_build_object (
										'cityByCity', (
											select json_build_object (
												'displayName', citiesTable.display_name
											)
											from public.cities citiesTable
											where citiesTable.id = addressTable.city
										)
									)
									from public.address addressTable
									where addressTable.id = covidPatientTable.address
								)
							)
							from public.covid_patients covidPatientTable
							where covidPatientTable.epidemiology_number = investigatedPatientTable.covid_patient
						)
					)
					from public.investigated_patient investigatedPatientTable
					where investigatedPatientTable.id = investigationTable.investigated_patient_id
				),
				'investigationStatusByInvestigationStatus', (
					select json_build_object (
						'displayName', investigationStatusTable.display_name
					)
					from public.investigation_status investigationStatusTable
					where investigationStatusTable.display_name = investigationTable.investigation_status 
				),
				'userByLastUpdator', (
					select json_build_object (
						'id', userTable.id,
						'userName', userTable.user_name
					) 
					from public.user userTable
					where userTable.id = investigationTable.last_updator
				)
            )
			order by
			CASE WHEN order_by='defaultOrder' THEN 
			investigationTable.corona_test_date::date END DESC,
			CASE WHEN order_by='defaultOrder' THEN
			investigationTable.priority END ASC,
			CASE WHEN order_by='coronaTestDateDESC' THEN investigationTable.corona_test_date::date END DESC,
			CASE WHEN order_by='coronaTestDateASC' THEN investigationTable.corona_test_date::date END ASC,
			CASE WHEN order_by='epidemiologyNumberDESC' THEN investigationTable.epidemiology_number END DESC,
 			CASE WHEN order_by='epidemiologyNumberASC' THEN investigationTable.epidemiology_number END ASC,
			CASE WHEN order_by='cityDESC' THEN (
				select display_name
				from public.cities
				where id = (
					select city from public.address
					where id = (
						select address from public.covid_patients
						where epidemiology_number = investigationTable.epidemiology_number
					)
				)
			) END DESC,
			CASE WHEN order_by='cityASC' THEN (
				select display_name
				from public.cities
				where id = (
					select city from public.address
					where id = (
						select address from public.covid_patients
						where epidemiology_number = investigationTable.epidemiology_number
					)
				)
			) END ASC,
			CASE WHEN order_by='ageDESC' THEN (
			select birth_date
			from public.covid_patients
			where epidemiology_number = investigationTable.epidemiology_number) END DESC,
			CASE WHEN order_by='ageASC' THEN (
			select birth_date
			from public.covid_patients
			where epidemiology_number = investigationTable.epidemiology_number) END ASC,
			CASE WHEN order_by='investigationStatusDESC' THEN investigationTable.investigation_status  END DESC,
 			CASE WHEN order_by='investigationStatusASC' THEN investigationTable.investigation_status  END ASC,
			CASE WHEN order_by='investigatorNameDESC' THEN (
				select user_name from public.user
				where id = investigationTable.last_updator
			) END DESC,
 			CASE WHEN order_by='investigatorNameASC' THEN (
				select user_name from public.user
				where id = investigationTable.last_updator
			) END ASC
        )
    ) investigations
from public.investigation investigationTable
where (
	investigationTable.last_updator = user_id
	AND
	investigationTable.investigation_status != 'טופלה'
));
END;
$BODY$;

ALTER FUNCTION public.user_investigations_sort(character varying, character varying)
    OWNER TO coronai;
