-- FUNCTION: public.user_investigations_by_date_and_priority(character varying)

-- DROP FUNCTION public.user_investigations_by_date_and_priority(character varying);

CREATE OR REPLACE FUNCTION public.user_investigations_by_date_and_priority(
	user_id character varying)
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
				'priority', investigationTable.priority,
				'investigatedPatientByInvestigatedPatientId', (
					select json_build_object (
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
							where addressTable.id = investigatedPatientTable.address
						),
						'personByPersonId', (
							select json_build_object (
								'birthDate', personTable.birth_date,
								'firstName', personTable.first_name,
								'lastName', personTable.last_name,
								'phoneNumber', personTable.phone_number
							)
							from public.person personTable
							where personTable.id = investigatedPatientTable.person_id
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
			order by investigationTable.corona_test_date::date DESC,investigationTable.priority ASC
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

ALTER FUNCTION public.user_investigations_by_date_and_priority(character varying)
    OWNER TO coronai;
