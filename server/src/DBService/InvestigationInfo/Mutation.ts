import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATION_STATUS = gql`
mutation UpdateInvestigationStatus($epidemiologyNumber: Int!, $investigationStatus: Int!, $investigationSubStatus: String, $statusReason: String, $startTime: Datetime , $lastUpdateTime: Datetime, $endTime: Datetime) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus, investigationSubStatus: $investigationSubStatus, statusReason: $statusReason, startTime: $startTime, lastUpdateTime:$lastUpdateTime, endTime:$endTime}, epidemiologyNumber: $epidemiologyNumber}) {
    clientMutationId
  }
}
`;

export const UPDATE_MUTATION_INFO = gql`
mutation UpdateInvestigationWasVarientUpdate($epidemiologyNumber: Int!) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {wasMutationUpdated: false}, epidemiologyNumber: $epidemiologyNumber}) {
    clientMutationId
  }
}
`;

export const ADD_INVESTIGATION_START_TIME = gql`
mutation addInvestigationStartTime($investigationIdInput: Int!, $timeInput: Datetime!) {
  createInvestigationTime(input: {investigationTime: {investigationStatus: 100000002, investigationId: $investigationIdInput, actionTime: $timeInput}}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATION_START_TIME = gql`
  mutation updateInvestigationStartTime($timeInput: Datetime!, $investigationIdInput: Int!) {
    updateInvestigationStartTime(input: {timeInput: $timeInput, investigationIdInput: $investigationIdInput}) {
      clientMutationId
    }
  }
`;

export const UPDATE_INVESTIGATION_END_TIME = gql`
  mutation updateInvestigationEndTime($timeInput: Datetime!, $investigationIdInput: Int!) {
    updateInvestigationEndTime(input: {timeInput: $timeInput, investigationIdInput: $investigationIdInput}) {
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
mutation updateInvestigatedPatientById ($wasInVacation: Boolean, $wasInEvent: Boolean, $wereConfirmedExposuresDesc: String $id: Int!) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {wasInVacation: $wasInVacation, wasInEvent: $wasInEvent, wereConfirmedExposuresDesc: $wereConfirmedExposuresDesc }, id: $id}) {
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
mutation updateInvestigationReasonsId ($epidemiologyNumberInput: Int!, $newComplexityReasonId: Int!) {
  updateInvestigationReasonsId(input: {epidemiologyNumberInput: $epidemiologyNumberInput, newComplexityReasonId: $newComplexityReasonId}) {
    clientMutationId
  }
}
`;

export const DELETE_INVESTIGATION_COMPLEXITY_REASON_ID = gql`
mutation deleteinvestigationReasonsId ($epidemiologyNumberInput: Int!, $oldComplexityReasonId: Int!) {
  deleteInvestigationReasonsId(input: {epidemiologyNumberInput: $epidemiologyNumberInput, oldComplexityReasonId: $oldComplexityReasonId}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATION_STATIC_INFO = gql`
mutation updateInvestigationStaticInfo ($fullNameInput: String, $identificationTypeInput: Int, $identityNumberInput: String, $epidemiologyNumberInput: Int!) {
  updateStaticInfo(input: {fullNameInput: $fullNameInput, identificationTypeInput: $identificationTypeInput, identityNumberInput: $identityNumberInput, epidemiologyNumberInput: $epidemiologyNumberInput}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATION_TRACKING = gql`
mutation updateTrackingRecommendation ($inputEpidemiologyNumber: Int!, $extraInfo: String, $reason: Int, $subReason: Int) {
  updateTrackingRecommendation(input: {extraInfo: $extraInfo, inputEpidemiologyNumber: $inputEpidemiologyNumber, reason: $reason, subReason: $subReason}) {
    clientMutationId
  }
}
`;

export const UPDATE_BOT_INVESTIGATION_INVESTIGATOR_REFERENCE_STATUS = gql`
mutation updateInvestigatorReferenceStatus ($epidemiologyNumber: Int!, $investigatorReferenceStatusId: Int) {
  updateBotInvestigationByEpidemiologyNumber(input: {epidemiologyNumber: $epidemiologyNumber, botInvestigationPatch: {investigatorReferenceStatusId: $investigatorReferenceStatusId}}) {
    clientMutationId
  }
}
`;

export const UPDATE_COVID_PATIENT_FULLNAME = gql`
mutation updateCovidPatientFullName ($epidemiologyNumber: Int!, $fullName: String) {
  updateCovidPatientByEpidemiologyNumber(input: {epidemiologyNumber: $epidemiologyNumber, covidPatientPatch: {fullName: $fullName}}) {
    clientMutationId
  }
}
`;

export const UPDATE_INVESTIGATION_STATUS_AND_COMMENT = gql`
mutation UpdateInvestigationStatus($epidemiologyNumber: Int!, $investigationStatus: Int!, $investigationSubStatus: String, $statusReason: String, $startTime: Datetime , $comment: String) {
  updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {investigationStatus: $investigationStatus, investigationSubStatus: $investigationSubStatus, statusReason: $statusReason, startTime: $startTime, comment:$comment}, epidemiologyNumber: $epidemiologyNumber}) {
    clientMutationId
  }
}
`;