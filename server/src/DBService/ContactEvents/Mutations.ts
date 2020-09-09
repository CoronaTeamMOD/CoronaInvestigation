import { gql } from 'postgraphile';

export const CREATE_CONTACT_EVENT = gql`
mutation createContactEvent($contactEvent: ContactEventInput!) {
  createContactEvent(input: {contactEvent: $contactEvent}) {
    clientMutationId
  }
}
`;