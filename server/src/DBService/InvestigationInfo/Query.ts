import { gql } from 'postgraphile';

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    comment
    startTime
    lastUpdateTime
    investigatingUnit
    endTime
    investigatedPatientByInvestigatedPatientId {
      covidPatientByCovidPatient {
        identityNumber
        fullName
        primaryPhone
        birthDate
      }
      identityType
      additionalPhoneNumber
      gender
      isDeceased
      isCurrentlyHospitalized
      isInClosedInstitution
    }
    coronaTestDate
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

export const GET_SUB_STATUSES = gql`
query GetAllSubStatuses {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC) {
    nodes {
      displayName
    }
  }
}
`;

export const GET_SUB_STATUSES_BY_STATUS = gql`
query GetAllSubStatuses($parentStatus: String!) {
  allInvestigationSubStatuses(orderBy: DISPLAY_NAME_ASC, filter: {parentStatus: {equalTo: $parentStatus}}) {
    nodes {
      displayName
    }
  }
}
`;

export const GET_STATUSES = gql`
query GetAllSubStatuses {
  allInvestigationStatuses {
    nodes {
      displayName
    }
  }
}
`;
