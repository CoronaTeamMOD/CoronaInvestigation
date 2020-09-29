import { gql } from 'postgraphile';

export const UPDATE_CONTACTED_PERSON = gql`
mutation updatedContactedPerson($currContactedPerson: Int!, $cantReachContact: Boolean!, $cityOfContacted: String!, $currCondition: Boolean!, 
  $doesLiveWithConfirmed: Boolean!, $doesNeedHelpInIsolation: Boolean!, $relationShip: String!, $repeatingOccuranceWithConfirmed: Boolean!,
  $familyRelationship: Int!, $doesWorkWithCrowd: Boolean!, $doesHaveBackgroundDiseases: Boolean!, $contacted_person_occupation: String!) {
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
      doesHaveBackgroundDiseases: $doesHaveBackgroundDiseases,
      occupation: $contacted_person_occupation
    }, 
    id: $currContactedPerson
  }) {
    clientMutationId
  }
}
`;

export const SAVE_ALL_CONTACTS = gql`
mutation updateAllUnSavedContacts($unSavedContacts: JSON!) {
  updateContactPersons(input: {contactedPersons: $unSavedContacts}) {
    clientMutationId
  }
}
`;