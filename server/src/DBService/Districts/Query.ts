import { gql } from 'postgraphile';

export const GET_ALL_DISTRICTS = gql`
query getAllDistricts {
    allDistricts {
      nodes {
        id
        displayName
      }
    }
  }  
`;
