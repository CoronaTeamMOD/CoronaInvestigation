import { gql } from 'postgraphile';

export const ADD_CITY_TEMP = gql`
    mutation addCityTemp($id: String!, $displayName: String!) {
      addCityTemp(input: {idInput: $id, displayNameInput: $displayName, deskMappingTechniqueInput: 1}){
          clientMutationId
        } 
    }
`;

export const ADD_CITIES_TEMP = gql`
    mutation addCitiesTemp($syncCitiesInput: JSON!) {
      addCitiesTemp(input: {syncCities: $syncCitiesInput}){
          clientMutationId
        } 
    }
`;

export const ADD_STREETS_TEMP = gql`
    mutation addStreetsTemp($syncStreetsInput: JSON!) {
      addStreetsTemp(input: {syncStreets: $syncStreetsInput}) {
            clientMutationId
        }
    }
`;
