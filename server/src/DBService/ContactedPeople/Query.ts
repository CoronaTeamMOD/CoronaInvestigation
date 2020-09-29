import { gql } from 'postgraphile';

export const GET_CONTACTED_PEOPLE = gql`
query ContactedPeopleByInvestigationId ($investigationId: Int!) {
  allContactedPeople(filter: {contactEventByContactEvent: {investigationId: {equalTo: $investigationId}}}) {
    nodes {
      personByPersonInfo {
        id
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
    }
  }
}
`;
