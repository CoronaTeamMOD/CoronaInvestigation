import { gql } from 'postgraphile';

export const GET_OCCUPATIONS = gql`
query MyQuery {
    allOccupations {
        nodes {
            displayName
        }
    }
}  
`;

export const GET_HMOS = gql`
query MyQuery {
    allHmos {
        nodes {
            displayName
        }
    }
}  
`;
