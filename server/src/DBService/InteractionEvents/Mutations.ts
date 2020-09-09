import { gql } from 'postgraphile';

export const ADD_INTERACTION_EVENT = gql`
mutation createEvent($contactEvent: CreateEventInput!) {
  createEvent(input: $contactEvent) {
    clientMutationId
  }
}
`