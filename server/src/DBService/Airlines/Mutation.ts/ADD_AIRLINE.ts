import { gql } from 'postgraphile';

const ADD_AIRLINE = gql`
    mutation addAirline($displayName: String) {
      createAirline(input: {airline: {displayName: $displayName}}) {
        clientMutationId
    }
}
`;

export default ADD_AIRLINE;