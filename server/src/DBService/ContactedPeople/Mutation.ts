import { gql } from 'postgraphile';

export const UPDATE_CONTACTED_PERSON = gql`
mutation updatedContactedPerson($currContactedPerson: Int!, $cantReachContact: Boolean!, $cityOfContacted: String!, $currCondition: Boolean!, 
  $doesLiveWithConfirmed: Boolean!, $doesNeedHelpInIsolation: Boolean!, $relationShip: String!, $repeatingOccuranceWithConfirmed: Boolean!,
  $familyRelationship: Int!, $doesWorkWithCrowd: Boolean!, $doesHaveBackgroundDiseases: Boolean!) {
  updateContactedPersonById(input: {
    contactedPersonPatch: {
      cantReachContact: $cantReachContact, 
      contactedPersonCity: $cityOfContacted, 
      doesFeelGood: $currCondition, 
      doesLiveWithConfirmed: $doesLiveWithConfirmed, 
      doesNeedHelpInIsolation: $doesNeedHelpInIsolation, 
      relationship: $relationShip, 
      repeatingOccuranceWithConfirmed: $repeatingOccuranceWithConfirmed, 
      familyRelationship: $familyRelationship, 
      crowd: $doesWorkWithCrowd, 
      doesHaveBackgroundDiseases: $doesHaveBackgroundDiseases}, 
    id: $currContactedPerson
  }) {
    clientMutationId
  }
}
`;