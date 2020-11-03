import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumber: Int!, $updatedDesk: Int!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {deskId: $updatedDesk}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;