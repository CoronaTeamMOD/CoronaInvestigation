import { gql } from 'postgraphile';

export const EDIT_CONTACT_EVENT = gql`
mutation editContactEvent ($event: JSON!) {
  updateContactEventFunction(input: {inputData: $event}) {
    clientMutationId
  }
}   
`;

export const CREATE_CONTACT_EVENT = gql`
mutation createContactEvent ($contactEvent: JSON!) {
  updateContactEventFunction(input: {inputData: $contactEvent}) {
      clientMutationId
  }
}   
`;