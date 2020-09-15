import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATION_METADATA = gql`
mutation UpdateInvestigationUpdateTimeAndUpdator ($epidemiologyNumber: Int!, $lastUpdateTime: Datetime!, $lastUpdator: String!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {lastUpdateTime: $lastUpdateTime, lastUpdator: $lastUpdator}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;
