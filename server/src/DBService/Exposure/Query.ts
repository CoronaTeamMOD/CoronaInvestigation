import { gql } from "postgraphile";

export const GET_EXPOSURE_INFO = gql`
query ExposureByInvestigationId ($investigationId: Int!){
    allExposures(condition: {investigationId: $investigationId}) {
        nodes {
            exposureFirstName
            exposureLastName
            exposureDate
            exposureAddress
            placeTypeByExposurePlaceType {
            displayName
            nodeId
            }
            flightDestinationCity
            flightDestinationAirport
            flightOriginCity
            flightOriginAirport
            flightStartDate
            flightEndDate
            airline
            flightNum
            countryByFlightDestinationCountry {
            displayName
            id
            }
            countryByFlightOriginCountry {
            displayName
            id
            }
            wasAbroad
            wasConfirmedExposure
        }
    }
}`;