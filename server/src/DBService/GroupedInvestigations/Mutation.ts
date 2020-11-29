import { gql } from 'postgraphile';

export const CREATE_GROUP_FOR_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupForInvestigationsInput!) {
    createGroupForInvestigations(input: $input) {
        clientMutationId
  }
}   
`;

export const UPDATE_GROUPED_INVESTIGATIONS = gql`
mutation UpdateGroupedInvestigations($epidemiologyNumbers: [Int], $groupId: UUID ) {
updateGroupedInvestigations(input: {epidemiologyNumbers: $epidemiologyNumbers, val: $groupId }) {
    clientMutationId
  }
}
`;