import { gql } from 'postgraphile';

export const UPDATE_LIST_OF_CONTACTS = gql`
mutation updateAllUnSavedContacts($unSavedContacts: JSON!) {
  updateContactPersons(input: {contactedPersons: $unSavedContacts}) {
    clientMutationId
  }
}
`;

export const CHECK_FOR_DUPLICATE_CONTACTED_PERSON_IDS = gql`
mutation checkForExistingIds($currInvestigationId: Int!) {
  checkForDuplicateIds(input: {currinvestigationid: $currInvestigationId}) {
    boolean
  }
}
`;
