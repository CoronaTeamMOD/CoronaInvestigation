import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumbers: [Int!]!, $updatedDesk: Int, $transferReason: String, $transferReasonId: Int) {
    updateInvestigationDeskByEpidemiologyNumbers(input: { updatedDesk: $updatedDesk, epidemiologyNumbers: $epidemiologyNumbers, reason: $transferReason, reasonId:$transferReasonId}) {
      clientMutationId
    }
  }
`;

export const UPDATE_DESK_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($desk: Int, $selectedGroups: [UUID!]!, $userCounty: Int!, $reason: String, $transferReasonId:Int) {
  updateDeskByGroupId(input: {desk: $desk, selectedGroups: $selectedGroups, userCounty: $userCounty, reason: $reason, reasonId:$transferReasonId}) {
    clientMutationId
  }
}
`;

export const CREATE_ADMIN_MESSAGE = gql`
mutation createAdminMessage($message: String!, $desksId: [Int]!, $adminId: String!) {
  createAdminMessage(
    input: {adminMessage: {message: $message, desksId: $desksId, adminId: $adminId}}
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
