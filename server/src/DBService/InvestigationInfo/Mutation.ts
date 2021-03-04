import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATION_STATUS = gql`
mutation UpdateInvestigationStatus($epidemiologyNumber: Int!, $investigationStatus: Int!, $investigationSubStatus: String, $statusReason: String) {
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

export const UPDATE_INVESTIGATED_PATIENT_RESORTS_DATA = gql`
mutation updateInvestigatedPatientById ($wasInEilat: Boolean!, $wasInDeadSea: Boolean!, $id: Int!) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {wasInEilat: $wasInEilat, wasInDeadSea: $wasInDeadSea}, id: $id}) {
      clientMutationId
    }
}
`;

export const UPDATE_INVESTIGAION_SETTINGS_FAMILY_DATA = gql`
mutation investigationSettingsFamilyData ($allowUncontactedFamily: Boolean!, $id: Int!) {
  updateInvestigationSettingByEpidemiologyNumber(input: {investigationSettingPatch: {allowUncontactedFamily: $allowUncontactedFamily}, epidemiologyNumber: $id}) {
    clientMutationId
  }
}
`;

export const CLOSE_ISOLATED_CONTACT = gql`
mutation closeIsolateContacts ($epiNumber: Int!) {
  closeIsolateContacts(input: {epiNumber: $epiNumber}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATION_COMPLEXITY_REASON_ID = gql`
mutation investigationReasonId ($epidemiologyNumberInput: Int!, $newComplexityReasonId: Int!) {
  updateInvestigationReasonsId(input: {epidemiologyNumberInput: $epidemiologyNumberInput, newComplexityReasonId: $newComplexityReasonId}) {
    clientMutationId
  }
}
`;

export const DELETE_INVESTIGATION_COMPLEXITY_REASON_ID = gql`
mutation deleteinvestigationReasonId ($epidemiologyNumberInput: Int!, $oldComplexityReasonId: Int!) {
  deleteInvestigationReasonsId(input: {epidemiologyNumberInput: $epidemiologyNumberInput, oldComplexityReasonId: $oldComplexityReasonId}) {
    clientMutationId
  }
}
`;

