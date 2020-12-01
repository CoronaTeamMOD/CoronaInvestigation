import { gql } from 'postgraphile';

export const CREATE_GROUPED_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupedInvestigationsInput!) {
  createGroupedInvestigations(input: $input) {
        clientMutationId
  }
}   
`;

export const DISBAND_GROUP_IDS = gql`
mutation disbandGroupId($groupId: UUID) {
  disband_group_id(input:{ groupId: $groupId }) {
    clientMutationId
  }
}
`;