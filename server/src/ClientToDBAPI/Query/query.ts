import { gql } from "postgraphile";

export const UPDATE_LAST_UPDATE_TIME = gql`
mutation UpdateLastUpdateTime ($epidemiologyNumber: Int!, $lastUpdateTime: DateTime!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {lastUpdateTime: $lastUpdateTime}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
   
`;