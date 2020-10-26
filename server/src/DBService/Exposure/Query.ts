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
query getOptionalExposureSources($searchRegex: String!) {
    allCovidPatients(filter: {or: [{fullName: {like: $searchRegex}}, {identityNumber: {like: $searchRegex}}, {primaryPhone: {like: $searchRegex}}]}) {
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
