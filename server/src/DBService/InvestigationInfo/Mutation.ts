import { gql } from "postgraphile";

export const UPDATE_INVESTIGATION_STATUS = gql`
  mutation UpdateInvestigationStatus($investigationStatus: String!, $epidemiologyNumber: Int!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;