import {gql} from 'postgraphile';

export const GET_ALL_COUNTIES = gql`
query allCounties {
  allCounties {
    nodes {
      id
      displayName,
      district
    }
  }
}
`;

export const GET_COUNTY_DISPLAY_NAME_BY_USER = gql`
query getCounty($id: Int!) {
  countyById(id: $id) {
    displayName
  }
}
`;