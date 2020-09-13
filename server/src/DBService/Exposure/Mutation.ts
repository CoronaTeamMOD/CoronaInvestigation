import { gql } from "postgraphile";

export const UPDATE_EXPOSURE = gql`
mutation updateExposure($exposureId: Int!, $data: ExposurePatch!) {
  updateExposureById(input: {exposurePatch: $data, id: $exposureId}) {
    clientMutationId
  }
}
`;

export const CREATE_EXPOSURE = gql`
mutation CreateExposure ($data: ExposureInput!){
    createExposure(input: {exposure: $data}) {
      clientMutationId
    }
  }
  `;