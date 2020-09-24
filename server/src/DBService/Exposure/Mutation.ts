import { gql } from "postgraphile";

// export const UPDATE_EXPOSURES = gql`
// mutation updateExposures ($investigationId: Int!, $exposures: ExposureInput[]!) {
//   updateExposureFunction(input: {exposures: $exposures, investigationId: $investigationId}) {
//     clientMutationId
//   }
// }   
// `;

export const UPDATE_EXPOSURES = gql`
mutation updateExposures ($inputExposure: JSON!) {
  updateExposureFunction(input: {inputExposure: $inputExposure}) {
    clientMutationId
  }
}   
`;