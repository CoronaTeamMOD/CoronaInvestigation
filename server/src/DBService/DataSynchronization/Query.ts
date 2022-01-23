import { gql } from 'postgraphile';

export const GET_LAST_STREET_ID = gql`
mutation getLastStreetId {
    getLastStreetId(input: {}){
      string
    }
  }
`;
