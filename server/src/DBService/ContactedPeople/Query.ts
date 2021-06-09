import { gql } from 'postgraphile';


export const GET_CONTACTED_PEOPLE = gql`
query ContactedPeopleByInvestigationId ($investigationId: Int!, $minimalDateToFilter: Datetime!, $offset: Int, $size: Int) {
  allContactedPeople(filter: {contactEventByContactEvent: {investigationId: {equalTo: $investigationId}, startTime: {greaterThanOrEqualTo: $minimalDateToFilter}}},
    orderBy: [INVOLVED_CONTACT_BY_INVOLVED_CONTACT_ID__INVOLVEMENT_REASON_ASC, PERSON_BY_PERSON_INFO__PHONE_NUMBER_ASC],
    ,offset: $offset, first: $size) {
    nodes {
      personInfo
      personByPersonInfo {
        firstName
        lastName
        phoneNumber
        identificationType: identificationTypeByIdentificationType {
          id
          type
        }
        identificationNumber
        birthDate
        additionalPhoneNumber
        gender
        personContactDetailByPersonInfo {
          extraInfo
          relationship
          familyRelationship
          occupation
          doesHaveBackgroundDiseases
          doesFeelGood
          doesNeedHelpInIsolation
          repeatingOccuranceWithConfirmed
          doesLiveWithConfirmed
          doesWorkWithCrowd
          doesNeedIsolation
          contactStatus
          creationTime
          involvedContactId
          involvementReason: involvedContactByInvolvedContactId {
            involvementReason
          }
          isolationAddress: addressByIsolationAddress {
          city: cityByCity {
            id
            displayName
          }
          street: streetByStreet {
            id
            displayName
          }
            houseNum
            apartment
        	}
        }
      }
      contactEventByContactEvent {
        placeName
        startTime
        id
      }        
      contactType
      id
    }
  }
}
`;

export const GET_ALL_FAMILY_RELATIONSHIPS = gql`
query getAllFamilyRelationships {
  allFamilyRelationships(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_ALL_CONTACT_STATUSES = gql`
query getAllContactStatuses {
  allContactStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;

export const GET_FOREIGN_KEYS_BY_NAMES = gql`
query getContactedPersonForeignIds($contactType:String!, $familyRelationship:String!, $contactStatus:String!) {
  allContactTypes(condition: {displayName: $contactType}, first: 1) {
    nodes {
      id
    }
  }
   allFamilyRelationships(condition: {displayName: $familyRelationship}, first: 1) {
    nodes {
      id
    }
  }
  allContactStatuses(condition: {displayName: $contactStatus}, first: 1) {
    nodes {
      id
    }
  }
}
`;