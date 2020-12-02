import { gql } from 'postgraphile';

export const CREATE_GROUPED_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupedInvestigationsInput!) {
  createGroupedInvestigations(input: $input) {
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