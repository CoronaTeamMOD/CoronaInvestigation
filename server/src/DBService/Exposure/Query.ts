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
            isExposurePersonKnown
            borderCheckpointByBorderCheckpoint {
                displayName
                id
                borderCheckpointTypeId
            }
            borderCheckpointType
            arrivalDateToIsrael
            arrivalTimeToIsrael
            flightSeatNum
            otherFlightNum
            otherAirline
            lastDestinationCountry
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

export const GET_EXPOSURE_DATA = gql`
query ExposureByInvestigationId ($investigationId: Int!){
    allExposures(condition: {investigationId: $investigationId}) {
        nodes {
            id
            exposureDate
            wasAbroad
            wasConfirmedExposure
            wasInEvent
            wasInVacation
            borderCheckpointByBorderCheckpoint {
                displayName
                borderCheckpointTypeId
                id
            }
            borderCheckpointType
            arrivalDateToIsrael
            arrivalTimeToIsrael
            countryByLastDestinationCountry {
                displayName
                id
              }
            wereConfirmedExposuresDesc 
            creationSource
            exposureDetailsByExposureId {
                nodes {
                    id
                    exposureAddress
                    exposurePlaceSubType
                    exposurePlaceType
                    isExposurePersonKnown
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
              flightsByExposureId {
                nodes {
                    id
                    countryByFlightOriginCountry {
                        displayName
                        id
                      }
                      countryByFlightDestinationCountry {
                        displayName
                        id
                      }
                    flightDestinationAirport
                    flightEndDate
                    flightNum
                    flightOriginAirport
                    flightSeatNum
                    flightStartDate
                    airlineByAirlineId {
                        displayName
                        id
                      }
                    otherAirline
                    otherFlightNum
                }
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
            first: 100
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

export const GET_EXPOSURE_SOURCE_BY_EPIDEMIOLOGY_NUMBER = gql`
    query getOptionalExposureSources($epidemiologyNumber: Int, $startDate : Datetime! , $endDate : Datetime!) {
        allCovidPatients(
            filter: {
                and : [
                    { validationDate: {greaterThanOrEqualTo: $startDate} }
                    { validationDate: {lessThanOrEqualTo: $endDate} }
                    { epidemiologyNumber: {equalTo: $epidemiologyNumber } }
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

export const FILTER_EXPOSURE_SOURCE = gql`
    query filterExposureSource($filter: JSON!) {
        allCovidPatients(
            filter: $filter 
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

export const GET_ALL_BORDER_CHECKPOINT_TYPES = gql`
    query allBorderCheckpointTypes {
    allBorderCheckpointTypes(orderBy: DISPLAY_NAME_ASC) {
        nodes {
        id
        displayName
        }
    }
}
`;


export const GET_ALL_BORDER_CHECKPOINTS = gql`
    query allBorderCheckpoints {
    allBorderCheckpoints(orderBy: DISPLAY_NAME_ASC) {
        nodes {
        id
        displayName
        borderCheckpointTypeId
        }
    }
}
`;