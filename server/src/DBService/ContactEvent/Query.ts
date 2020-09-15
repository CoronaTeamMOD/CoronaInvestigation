import { gql } from 'postgraphile';

export const GET_LOACTIONS_SUB_TYPES_BY_TYPES = gql`
query getPlacesSubTypesByTypes {
    allPlaceTypes {
      nodes {
        displayName
        placeSubTypesByParentPlaceType {
          nodes {
            id
            displayName
          }
        }
      }
    }
  }
`;

export const GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID = gql`
query getEventAndPeopleByInvestigationID($currInvestigation: Int!) {
  allContactEvents(condition: {investigationId: $currInvestigation}) {
    nodes {
      id
      airline
      allowsHamagenData
      boardingStation
      busCompany
      cityDestination
      cityOrigin
      busLine
      contactPersonFirstName
      contactPersonLastName
      contactPersonPhoneNumber
      contactPhoneNumber
      endStation
      endTime
      externalizationApproval
      flightDestinationAirport
      flightDestinationCity
      flightDestinationCountry
      flightNum
      flightOriginAirport
      flightOriginCity
      flightOriginCountry
      grade
      investigationId
      isolationStartDate
      locationAddress
      numberOfContacted
      placeName
      placeSubType
      placeType
      startTime
      trainLine
      contactedPeopleByContactEvent {
        nodes {
          id
          contactEvent
          doesNeedIsolation
          extraInfo
          personByPersonInfo {
            firstName
            identificationNumber
            lastName
            gender
            phoneNumber
          }
        }
      }
    }
  }
}
`;

export const GET_FULL_CONTACT_EVENT_BY_ID = gql`
query getEventByID($currEventId: Int!) {
  contactEventById(id: $currEventId) {
	    id
      airline
      allowsHamagenData
      boardingStation
      busCompany
      cityDestination
      cityOrigin
      busLine
      contactPersonFirstName
      contactPersonLastName
      contactPersonPhoneNumber
      contactPhoneNumber
      endStation
      endTime
      externalizationApproval
      flightDestinationAirport
      flightDestinationCity
      flightDestinationCountry
      flightNum
      flightOriginAirport
      flightOriginCity
      flightOriginCountry
      grade
      investigationId
      isolationStartDate
      locationAddress
      numberOfContacted
      placeName
      placeSubType
      placeType
      startTime
      trainLine
      contactedPeopleByContactEvent {
        nodes {
          id
          contactEvent
          doesNeedIsolation
          extraInfo
          personByPersonInfo {
            firstName
            identificationNumber
            lastName
            gender
            phoneNumber
          }
        }
      }
  }
}

`;