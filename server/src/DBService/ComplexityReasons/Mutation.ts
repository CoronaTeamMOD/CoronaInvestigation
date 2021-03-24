
import { gql } from 'postgraphile';

export const SET_COMPLEXITY_REASONS_ARRAY = gql`
mutation MyMutation($complexityReasonsIdInput: [Int]!, $epidemiologyNumberInput: Int!) {
  updateInvestigationByEpidemiologyNumber( input: {investigationPatch: {complexityReasonsId: $complexityReasonsIdInput}, epidemiologyNumber: $epidemiologyNumberInput}) {
    clientMutationId
  }
}
`;