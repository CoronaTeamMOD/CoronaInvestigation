import { gql } from 'postgraphile';

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    complexityReasonsId
    comment
    startTime
    lastUpdateTime
    investigatingUnit
    endTime
    doesHaveSymptoms
    isReturnSick
    previousDiseaseStartDate
    isSuspicionOfMutation
    mutationName
    isVaccinated
    vaccinationEffectiveFrom
    symptomsStartDate: symptomsStartTime
    contactInvestigationVerifiedAbroad
    contactFromAboardId
    investigatedPatientByInvestigatedPatientId {
      covidPatientByCovidPatient {
        identityNumber
        fullName
        primaryPhone
        birthDate
        validationDate
      }
      identificationType: identificationTypeByIdentityType {
        id
        type
      }
      additionalPhoneNumber
      gender
      isDeceased
      isCurrentlyHospitalized
      isInClosedInstitution
    }
    investigatedPatientId
    userByCreator {
      id
      userName
      phoneNumber
      serialNumber
      investigationGroup
    }
    userByLastUpdator {
      id
      userName
      phoneNumber
      serialNumber
      investigationGroup
    }
    userByLastUpdatorUser {
      id
      userName
      phoneNumber
      serialNumber
      investigationGroup
    }
    trackingSubReasonByTrackingSubReason {
      reasonId
      subReasonId
    }
    trackingExtraInfo
    vaccineDoseByVaccineDoseId {
      displayName
      id
    }
  }
}
`;

export const GET_BOT_INVESTIGATION_INFO = gql`
query BotInvestigationStaticDetails($investigationId: Int!) {
  botInvestigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
      epidemiologyNumber
      chatStatusByChatStatusId {
        id
        displayName
      }
      investigatiorReferenceRequired
      lastChatDate
      investigationChatStatusByInvestigationChatStatusId {
        displayName
        id
      }
      investigatorReferenceStatusByInvestigatorReferenceStatusId {
        id
        displayName
      }
      botInvestigationReferenceReasonsByBotInvestigationId {
        nodes {
          investigatorReferenceReasonByInvestigatorReferenceReasonId {
            displayName
            id
          }
        }
      }
      wasUpdatedAfterInvestigationStart
    }
}

`;

export const GET_MUTATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    isSuspicionOfMutation
    mutationName
    wasMutationUpdated
  }
}`;

export const GET_SUB_STATUSES_BY_STATUS = gql`
query GetAllSubStatuses($parentStatus: Int!) {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC, filter: {parentStatus: {equalTo: $parentStatus}, isActive: {equalTo: true}}) {
    nodes {
      displayName
      parentStatus
      id
      isActive
    }
  }
}
`;

export const GET_INVESTIGATED_PATIENT_RESORTS_DATA = gql`
query getInvestigatedPatientResortsData($id: Int!) {
  investigatedPatientById(id: $id) {
    wereConfirmedExposuresDesc
    wasInVacation
    wasInEvent
  }
}
`;

export const GET_INVESTIGAION_SETTINGS_FAMILY_DATA = gql`
query investigationSettingsFamilyData($id: Int!) {
  investigationSettingByEpidemiologyNumber(epidemiologyNumber: $id) {
    allowUncontactedFamily
  }
}
`;

export const GET_INVESTIGATION_CREATOR = gql`
query InvestigationCreator($epidemiologynumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologynumber) {
    userByCreator {
      investigationGroup
      id
      districtId: countyByInvestigationGroup {
        districtId
      }
    }
  }
}
`;

export const GROUP_ID_BY_EPIDEMIOLOGY_NUMBER = gql`
query groupIdByEpidemiologyNumber($epidemiologynumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologynumber) {
    groupId
  }
}
`;

export const GET_INVESTIGATION_COMPLEXITY_REASONS = gql`
query getAllInvestigationComplexityReasons {
  allInvestigationComplexityReasons(orderBy: REASON_ID_ASC) {
    nodes {
      description
      reasonId
      statusValidity
    }
  }
} 
`;

export const GET_INVESTIGATION_COMPLEXITY_REASON_ID = gql`
query getinvestigationReasonId ($epidemiologyNumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    complexityReasonsId
  }
}
`;

export const GET_BIRTHDATE = gql`
query getBirthdate ($epidemiologyNumber: Int!) {
  covidPatientByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    birthDate
  }
}
`;

export const GET_VACCINE_DOSE_ID = gql`
query getVaccineDoseId ($epidemiologyNumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    vaccineDoseId
  }
}
`;

export const GET_COMPLEXITY_REASONS_BIRTHDATE_AND_VACCINE_DOSE_ID = gql`
query getinvestigationData ($epidemiologyNumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    complexityReasonsId
    vaccineDoseId
    investigatedPatientByInvestigatedPatientId {
      covidPatientByCovidPatient {
        birthDate
      }
    }
  }
}
`;


export const GET_SETTINGS_FOR_STATUS_VALIDITY = gql`
query getinvestigationReasonId ($key: String!) {
  rulesConfigByKey(key: $key) {
    value
  }
}
`;

export const TRACKING_SUB_REASONS_BY_REASON_ID = gql`
  query trackingSubReasonsByReasonId($reasonId: Int!) {
    allTrackingSubReasons(filter: {reasonId: {equalTo: $reasonId}}) {
      nodes {
        id: subReasonId
        displayName
      }
    }
  }
`;

export const GET_IDENTIFICATION_TYPES = gql`
query getAllIdentificationTypes {
  allIdentificationTypes {
    nodes {
      id
      type
    }
  }
} 
`;