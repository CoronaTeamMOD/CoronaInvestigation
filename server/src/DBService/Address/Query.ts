import { gql } from 'postgraphile';

export const GET_ALL_CITIES = gql`
query getAllCities {
    allCities(orderBy: DISPLAY_NAME_ASC) {
      nodes {
        id
        displayName
      }
    }
  }
`;

export const GET_CITY_STREETS = gql`
query getCityStreets($id: String!) {
  cityById(id: $id) {
    streetsByCity(orderBy: DISPLAY_NAME_ASC) {
      nodes {
        displayName
        id
      }
    }
  }
}
`;

export const GET_ALL_COUNTRIES = gql`
query getAllCountries {
  allCountries(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      id
      displayName
    }
  }
}
`;
