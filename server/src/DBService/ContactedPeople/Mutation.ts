import { gql } from 'postgraphile';

export const UPDATE_LIST_OF_CONTACTS = gql`
mutation updateAllUnSavedContacts($unSavedContacts: JSON!) {
  updateContactPersons(input: {contactedPersons: $unSavedContacts}) {
    clientMutationId
  }
}
`;

export const SAVE_LIST_OF_CONTACTS = gql`
mutation saveContacts($contacts: JSON!, $contactEvent: Int!) {
  updateContactPerson(input: {contacts: $contacts, contactEventId: $contactEvent}) {
    clientMutationId
  }
}
`;
