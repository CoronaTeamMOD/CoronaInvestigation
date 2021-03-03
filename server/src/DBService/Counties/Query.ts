import { gql } from 'postgraphile';

export const GET_ALL_COUNTIES = gql`
query allCounties {
  allCounties(filter: {isDisplayed: {equalTo: true}}, orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
      district: districtByDistrictId {
        id
        displayName
      }
    }
  }
}
`;

export const DISTRICT_BY_COUNTY = gql`
query DistrictByCounty($id : Int!) {
  countyById(id: $id){
    districtId
  }
}
`;