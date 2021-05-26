import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumbers: [Int!]!, $updatedDesk: Int, $transferReason: String) {
    updateInvestigationDeskByEpidemiologyNumbers(input: { updatedDesk: $updatedDesk, epidemiologyNumbers: $epidemiologyNumbers, reason: $transferReason}) {
      clientMutationId
    }
  }
`;

export const UPDATE_DESK_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($desk: Int, $selectedGroups: [UUID!]!, $userCounty: Int!, $reason: String) {
  updateDeskByGroupId(input: {desk: $desk, selectedGroups: $selectedGroups, userCounty: $userCounty, reason: $reason}) {
    clientMutationId
  }
}
`;

export const CREATE_ADMIN_MESSAGE = gql`
mutation createAdminMessage($message: String!, $desks_id: [Int]!, $admin_id: String!) {
  createAdminMessage(
    input: {adminMessage: {message: $message, desksId: $desks_id, adminId: $admin_id}}
  ) {
    clientMutationId
  }
}
`;

export const DELETE_ADMIN_MESSAGE = gql`
mutation deleteAdminMessageById($id: Int!) {
  deleteAdminMessageById(
    input: {id: $id}
  ) {
    clientMutationId
  }
}
`;
