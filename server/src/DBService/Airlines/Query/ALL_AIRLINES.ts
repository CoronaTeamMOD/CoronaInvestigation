import { gql } from 'postgraphile';

const ALL_AIRLINES = gql`
    query AllAirlines {
        allAirlines {
            nodes {
                id
                displayName
            }
        }
    }
`;

export default ALL_AIRLINES;