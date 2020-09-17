import { gql } from "postgraphile";

export const GET_ALL_CITIES = gql`
query getAllCities {
    allCities {
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
    streetsByCity {
      nodes {
        displayName
        id: mhoCode
      }
    }
  }
}
`;

export const GET_ALL_COUNTRIES = gql`
  query getAllCountries {
    allCountries {
      nodes {
        id
        displayName
      }
    }
  }
`;