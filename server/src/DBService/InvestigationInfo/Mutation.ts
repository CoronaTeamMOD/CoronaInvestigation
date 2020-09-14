import { gql } from "postgraphile";

export const UPDATE_INVESTIGATION_STATUS = gql`
  mutation UpdateInvestigationStatus($investigationStatus: String!, $epidemiologyNumber: Int!, $endTime: Datetime!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus, endTime: $endTime}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;