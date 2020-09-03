import { gql } from 'postgraphile';

export const GET_ALL_CONTACTED_PEOPLE_BY_EVENT = gql`
query GET_CONTACTED_PEOPLE_OF_EVENT($currEvent: Int!) {
  allContactedPeople(condition: {contactEvent: $currEvent}) {
    nodes {
      personByPersonInfo {
        firstName
        lastName
        phoneNumber
      }
    }
  }
}
`;