import { gql } from 'postgraphile';

export const GET_LOACTIONS_SUB_TYPES_BY_TYPES = gql`
query getPlacesSubTypesByTypes {
    allPlaceTypes {
      nodes {
        displayName
        placeSubTypesByParentPlaceType {
          nodes {
            displayName
          }
        }
      }
    }
  }
`;  