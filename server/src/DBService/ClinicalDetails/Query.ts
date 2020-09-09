import { gql } from 'postgraphile';

export const GET_BACKGROUND_DISEASES = gql`
query getAllBackgroundDeseases {
    allBackgroundDeseases {
      nodes {
        displayName
      }
    }
  }  
`;

export const GET_SYMPTOMS = gql`
query getAllSymptoms {
    allSymptoms {
      nodes {
        displayName
      }
    }
  }  
`;
