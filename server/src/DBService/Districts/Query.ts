import { gql } from 'postgraphile';

export const GET_ALL_DISTRICRS = gql`
query allDistricts {
    allDistricts(filter: {orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;