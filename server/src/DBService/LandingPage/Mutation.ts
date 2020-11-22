import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumber: Int!, $updatedDesk: Int!, $transferReason: String) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {deskId: $updatedDesk, transferReason: $transferReason, wasInvestigationTransferred: true}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;