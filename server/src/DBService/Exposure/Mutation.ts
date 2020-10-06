import { gql } from "postgraphile";

export const UPDATE_EXPOSURES = gql`
mutation updateExposures ($inputExposures: JSON!) {
  updateExposuresFunction(input: {inputExposures: $inputExposures}) {
    clientMutationId
  }
}   
`;