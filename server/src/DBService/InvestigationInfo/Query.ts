import { gql } from 'postgraphile';

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    comment
    startTime
    lastUpdateTime
    investigatingUnit
    endTime
    doesHaveSymptoms
    symptomsStartDate: symptomsStartTime
    investigatedPatientByInvestigatedPatientId {
      covidPatientByCovidPatient {
        identityNumber
        fullName
        primaryPhone
        birthDate
        validationDate
      }
      identityType
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
  }
}
`;

export const GET_SUB_STATUSES_BY_STATUS = gql`
query GetAllSubStatuses($parentStatus: Int!) {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC, filter: {parentStatus: {equalTo: $parentStatus}}) {
    nodes {
      displayName
    }
  }
}
`;

export const GET_INVESTIGATED_PATIENT_RESORTS_DATA = gql`
query getInvestigatedPatientResortsData($id: Int!) {
  investigatedPatientById(id: $id) {
    wasInDeadSea
    wasInEilat
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