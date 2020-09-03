import { gql } from 'postgraphile';

export const ADD_CONTACTED_PERSON_TO_EVENT = gql`
mutation MyMutation($eventToUpdate: Int!, $infoOfContacted: Int!) {
  createContactedPerson(input: {contactedPerson: {personInfo: $eventToUpdate, contactEvent: $infoOfContacted}}) {
    clientMutationId
  }
}
`;