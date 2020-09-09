import { gql } from 'postgraphile';

export const CREATE_CONTACT_EVENT_AND_GET_ID = gql`
mutation createEventAndGetId($eventInput: InsertContactEventInput!) {
  insertContactEvent(input: $eventInput) {
    integer
  }
}
`;