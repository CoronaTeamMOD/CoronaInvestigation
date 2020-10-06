import { gql } from 'postgraphile';

export const SAVE_LIST_OF_CONTACTS = gql`
mutation updateAllUnSavedContacts($unSavedContacts: JSON!) {
  updateContactPersons(input: {contactedPersons: $unSavedContacts}) {
    clientMutationId
  }
}
`;
