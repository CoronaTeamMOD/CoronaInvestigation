import { gql } from 'postgraphile';

export const GET_ALL_AUTHORITIES = gql`
query getAllAuthorities {
    allAuthorities{
      nodes{
        id
        authorityName
      }
    }
  }
`;