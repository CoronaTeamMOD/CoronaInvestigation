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
      integer
  }
}   
`;

export const DELETE_CONTACT_EVENT = gql`
mutation deleteContactEvent ($contactEventId: Int!) {
  deleteContactEventFunction(input: {contactEventId: $contactEventId}) {
    clientMutationId
  }
}   
`;

export const DELETE_CONTCTED_PERSON = gql`
mutation DeleteContactedPerson($contactedPersonId: Int!) {
  deleteContactedPersonById(input: {id: $contactedPersonId}) {
    clientMutationId
  }
}
`;