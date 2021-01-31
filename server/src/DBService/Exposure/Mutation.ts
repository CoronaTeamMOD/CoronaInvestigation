import { gql } from "postgraphile";

export const UPDATE_EXPOSURES = gql`
mutation updateExposures ($inputExposures: JSON!) {
  updateExposuresFunction(input: {inputExposures: $inputExposures}) {
    clientMutationId
  }
}   
`;

export const DELETE_EXPOSURE_BY_ID = gql`
mutation deleteExposureById($exposureId: Int!) {
  deleteExposureById(input: {id: $exposureId}) {
    clientMutationId
  }
}
`;