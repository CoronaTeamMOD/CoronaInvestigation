import { gql } from 'postgraphile';

const ADD_FLIGHT = gql`
    mutation addFlight($airlineId: String!, $displayName: String!) {
      createFlightNumber(
        input: {flightNumber: {airlineId: $airlineId, displayName: $displayName}}){
          clientMutationId
        } 
    }
`;

export default ADD_FLIGHT;