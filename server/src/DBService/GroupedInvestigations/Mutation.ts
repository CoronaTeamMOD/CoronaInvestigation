import { gql } from 'postgraphile';

export const CREATE_GROUPED_INVESTIGATIONS = gql`
mutation createGroupForInvestigations ($input: CreateGroupedInvestigationsInput!) {
  createGroupedInvestigations(input: $input) {
        clientMutationId
  }
}   
`;