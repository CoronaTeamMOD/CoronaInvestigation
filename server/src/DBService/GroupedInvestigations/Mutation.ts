import { gql } from 'postgraphile';

export const CREATE_GROUPED_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupedInvestigationsInput!) {
  createGroupedInvestigations(input: $input) {
        clientMutationId
  }
}   
`;

export const EXCLUDE_FROM_GROUP = gql`
mutation excludeInvestigationFromGroup($investigationToExclude: Int!) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch : { groupId: null }, epidemiologyNumber: $investigationToExclude}) {
    clientMutationId
  }
}
`;

export const DISBAND_GROUP_IDS = gql`
mutation disbandGroupIds($groupIds: [UUID]) {
  disbandGroupIds(input:{ groupIds: $groupIds }) {
    clientMutationId
  }
}
`;