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

export const GET_ALL_CONTACT_TYPES = gql`
query getAllContactTypes {
  allContactTypes(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_FULL_CONTACT_EVENT_BY_INVESTIGATION_ID = gql`
query getEventAndPeopleByInvestigationID($currInvestigation: Int!) {
  allContactEvents(condition: {investigationId: $currInvestigation}) {
    nodes {
      id
      unknownTime
      hospitalDepartment
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
      placeDescription
      placeSubType
      placeType
      startTime
      trainLine
      creationTime
      contactedPeopleByContactEvent {
        nodes {
          id
          contactEvent
          contactStatus
          contactType
          extraInfo
          creationTime
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

export const GET_ALL_INVOLVED_CONTACTS = gql`
query getAllInvolvedContacts {
  allInvolvedContacts {
    nodes {
      familyRelationshipByFamilyRelationship {
        familyRelationship: displayName
      }
      personByPersonId {
        birthDate
        additionalPhoneNumber
        firstName
        identificationNumber
        identificationType
        lastName
        phoneNumber
      }
      involvementReason,
      isContactedPerson
      cityByIsolationCity {
        city: displayName
      }
    }
  }
}
`;