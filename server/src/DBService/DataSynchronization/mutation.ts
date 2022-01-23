import { gql } from 'postgraphile';

export const ADD_CITY_TEMP = gql`
    mutation addCityTemp($id: String!, $displayName: String!) {
      addCityTemp(input: {idInput: $id, displayNameInput: $displayName, deskMappingTechniqueInput: 1}){
          clientMutationId
        } 
    }
`;

export const ADD_CITIES_TEMP = gql`
    mutation addCitiesTemp($cities: JSON!) {
      addCityTemp(input: {cities: $cities}){
          clientMutationId
        } 
    }
`;
