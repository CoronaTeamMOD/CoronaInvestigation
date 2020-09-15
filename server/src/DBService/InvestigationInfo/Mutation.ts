import { gql } from "postgraphile";

export const UPDATE_INVESTIGATION_STATUS = gql`
  mutation UpdateInvestigationStatus($investigationStatus: String!, $epidemiologyNumber: Int!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;

export const UPDATE_INVESTIGATION_START_TIME = gql`
  mutation UpdateInvestigationStartTime($investigationStartTime: Datetime!, $epidemiologyNumber: Int!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {startTime: $investigationStartTime}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;

export const UPDATE_INVESTIGATION_END_TIME = gql`
  mutation UpdateInvestigationEndTime($investigationEndTime: Datetime!, $epidemiologyNumber: Int!) {
    updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {endTime: $investigationEndTime}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;