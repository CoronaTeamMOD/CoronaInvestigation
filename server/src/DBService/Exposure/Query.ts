import { gql } from "postgraphile";

export const GET_EXPOSURE_INFO = gql`
query ExposureByInvestigationId ($investigationId: Int!){
    allExposures(condition: {investigationId: $investigationId}) {
        nodes {
            id
            exposureFirstName
            exposureLastName
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
        }
    }
}
`;
