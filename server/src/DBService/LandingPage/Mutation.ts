import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumber: Int!, $updatedDesk: Int!, $transferReason: String) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {deskId: $updatedDesk, transferReason: $transferReason}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;

export const UPDATE_DESK_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($desk: Int!, $selectedGroups: [UUID!]!) {
  updateDeskByGroupId(input: {desk: $desk, selectedGroups: $selectedGroups}) {
    clientMutationId
  }
}
`;