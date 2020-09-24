import { gql } from "postgraphile";

export const UPDATE_EXPOSURES = gql`
mutation updateExposures ($inputExposure: JSON!) {
  updateExposureFunction(input: {inputExposure: $inputExposure}) {
    clientMutationId
  }
}   
`;