import { gql } from 'postgraphile';

export const GET_EXPOSURE_INFO = gql`
query ExposureByInvestigationId ($investigationId: Int!){
    allExposures(condition: {investigationId: $investigationId}) {
        nodes {
            id
            exposureDate
            exposureAddress
            exposurePlaceSubType
            exposurePlaceType
            flightDestinationCity
            flightDestinationAirport
            flightOriginCity
            flightOriginAirport
            flightStartDate
            flightEndDate
            airline
            flightNum
            flightOriginCountry
            flightDestinationCountry
            wasAbroad
            wasConfirmedExposure
            covidPatientByExposureSource {
              birthDate
              addressByAddress {
                cityByCity {
                  displayName
                }
                streetByStreet {
                  displayName
                }
                floor
                houseNum
              }
              epidemiologyNumber
              fullName
              identityNumber
              primaryPhone
            }
        }
    }
}
`;

export const GET_EXPOSURE_SOURCE_OPTIONS = gql`
    query getOptionalExposureSources($searchValue: String! , $searchInt: Int! , $searchStartDate : Datetime! , $searchEndDate : Datetime!) {
        allCovidPatients(
            filter: {
                or: [
                    { fullName: { includes: $searchValue } }
                    { identityNumber: { includes: $searchValue } }
                    { primaryPhone: { includes: $searchValue } }
                    { epidemiologyNumber: {equalTo: $searchInt } }
                ]
                and : [
                    { validationDate: {greaterThanOrEqualTo: $searchStartDate} }
                    { validationDate: {lessThanOrEqualTo: $searchEndDate} }
                ]
            }
        ) {
            nodes {
                fullName
                identityNumber
                primaryPhone
                epidemiologyNumber
                birthDate
                addressByAddress {
                    cityByCity {
                        displayName
                    }
                    streetByStreet {
                        displayName
                    }
                    floor
                    houseNum
                }
            }
        }
    }
`;

export const GET_EXPOSURE_SOURCE_BY_PERSONAL_DETAILS = gql`
    query getOptionalExposureSources($name: String, $phoneNum: String, $startDate : Datetime! , $endDate : Datetime!) {
        allCovidPatients(
            filter: {
                and : [
                    { validationDate: {greaterThanOrEqualTo: $startDate} }
                    { validationDate: {lessThanOrEqualTo: $endDate} }
                    { fullName: { includes: $name } }
                    { primaryPhone: { includes: $phoneNum } }
                ]
            }
        ) {
            nodes {
                fullName
                identityNumber
                primaryPhone
                epidemiologyNumber
                birthDate
                addressByAddress {
                    cityByCity {
                        displayName
                    }
                    streetByStreet {
                        displayName
                    }
                    floor
                    houseNum
                }
            }
        }
    }
`;