import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATION_STATUS = gql`
mutation UpdateInvestigationStatus($epidemiologyNumber: Int!, $investigationStatus: String!, $investigationSubStatus: String, $statusReason: String) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus, investigationSubStatus: $investigationSubStatus, statusReason: $statusReason}, epidemiologyNumber: $epidemiologyNumber}) {
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

export const COMMENT = gql`
  mutation addComment($comment: String, $epidemiologyNumber: Int!) {
        updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {comment: $comment}, epidemiologyNumber: $epidemiologyNumber}) {
          clientMutationId
        }
  }
`;

export const UPDATE_INVESTIGATION_TRANSFER = gql`
mutation UpdateInvestigationStatus($epidemiologyNumber: Int!) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {wasInvestigationTransferred: true}, epidemiologyNumber: $epidemiologyNumber}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA = gql`
mutation updateInvestigatedPatientById ($wasInEilat: Boolean!, $wasInDeadSea: Boolean!, $id: Int!) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {wasInEilat: $wasInEilat, wasInDeadSea: $wasInDeadSea}, id: $id}) {
      clientMutationId
    }
}
`;