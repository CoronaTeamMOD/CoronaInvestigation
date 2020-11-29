import { gql } from 'postgraphile';

export const CREATE_GROUP_FOR_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupedInvestigationsInput!) {
  createGroupedInvestigations(input: $input) {
        clientMutationId
  }
}   
`;