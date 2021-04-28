import { gql } from 'postgraphile';

export const GET_ALL_DISTRICTS = gql`
query allDistricts {
    allDistricts(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;