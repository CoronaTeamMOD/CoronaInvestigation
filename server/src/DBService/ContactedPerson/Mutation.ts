import { gql } from 'postgraphile';

export const CREATE_PERSON = gql`
mutation createPerson {
  insertPersonAndGetId(input: {contactedFirstName: "דניאל", contactedLastName: "אייזנברג"}) {
    integer
  }
}
`;

export const CREATE_CONTACTED_PERSON = gql`
mutation createContactedPerson($contactedPerson: ContactedPersonInput!) {
  createContactedPerson(input: {contactedPerson: $contactedPerson}) {
    clientMutationId
  }
}
`;