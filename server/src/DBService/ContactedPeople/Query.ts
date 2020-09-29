import {gql} from 'postgraphile';

export const GET_CONTACTED_PEOPLE = gql`
query ContactedPeopleByInvestigationId ($investigationId: Int!) {
  allContactedPeople(filter: {contactEventByContactEvent: {investigationId: {equalTo: $investigationId}}}) {
    nodes {
      personByPersonInfo {
        firstName
        lastName
        phoneNumber
        identificationType
        identificationNumber
        birthDate
        additionalPhoneNumber
        gender
      }
      contactEventByContactEvent {
        startTime
      }
      id
      doesNeedIsolation
      extraInfo
      relationship
      familyRelationship
      occupation
      doesHaveBackgroundDiseases
      contactType
      contactedPersonCity
      doesFeelGood
      doesNeedHelpInIsolation
      repeatingOccuranceWithConfirmed
      doesLiveWithConfirmed
      cantReachContact
      doesWorkWithCrowd
    }
  }
}
`;

export const GET_ALL_FAMILY_RELATIONSHIPS = gql`
query getAllFamilyRelationships {
  allFamilyRelationships {
    nodes {
      id
      displayName
    }
  }
}
`;
