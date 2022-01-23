import { gql } from 'postgraphile';

export const ADD_CITIES = gql`
    mutation addCities($syncCitiesInput: JSON!) {
      addCities(input: {cities: $syncCitiesInput}){
          clientMutationId
        } 
    }
`;

export const ADD_STREETS = gql`
    mutation addStreets($syncStreetsInput: JSON!) {
      addStreets(input: {streets: $syncStreetsInput}) {
            clientMutationId
        }
    }
`;
