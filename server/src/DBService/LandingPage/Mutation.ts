import { gql } from "postgraphile";

export const CHANGE_DESK_ID = gql`
  mutation ChangeDeskId($epidemiologyNumbers: [Int!]!, $updatedDesk: Int!, $transferReason: String) {
    updateInvestigationDeskByEpidemiologyNumbers(input: { updatedDesk: $updatedDesk, epidemiologyNumbers: $epidemiologyNumbers, reason: $transferReason}) {
      clientMutationId
    }
  }
`;

export const UPDATE_DESK_BY_GROUP_ID = gql`
mutation updateInvestigatorByGroupId($desk: Int!, $selectedGroups: [UUID!]!, $userCounty: Int!, $reason: String) {
  updateDeskByGroupId(input: {desk: $desk, selectedGroups: $selectedGroups, userCounty: $userCounty, reason: $reason}) {
    clientMutationId
  }
}
`;