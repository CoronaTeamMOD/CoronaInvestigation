import { gql } from 'postgraphile';

const FLIGHTS_BY_AIRLINE_ID = gql`
    query FlightNumbersByFlightId($airlineId: String!) {
        allFlightNumbers(filter: {airlineId: {equalTo: $airlineId}}) {
            nodes {
                displayName
            }
        }
    }
`;

export default FLIGHTS_BY_AIRLINE_ID;