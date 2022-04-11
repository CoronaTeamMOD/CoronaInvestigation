import { gql } from 'postgraphile';

const FLIGHTS_BY_AIRLINE_ID = gql`
    query FlightNumbersByFlightId($airlineId: Int!) {
        allFlightNumbers(filter: {airlineId: {equalTo: $airlineId}}) {
            nodes {
                displayName
            }
        }
    }
`;

export default FLIGHTS_BY_AIRLINE_ID;