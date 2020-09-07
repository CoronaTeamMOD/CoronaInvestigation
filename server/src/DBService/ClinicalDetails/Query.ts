import { gql } from 'postgraphile';

export const GET_BACKGROUND_DISEASES = gql`
query MyQuery {
    allBackgroundDeseases {
      nodes {
        displayName
      }
    }
  }  
`;

export const GET_SYMPTOMS = gql`
query MyQuery {
    allSymptoms {
      nodes {
        displayName
      }
    }
  }  
`;
