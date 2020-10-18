import { gql } from "postgraphile";

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    startTime
    lastUpdateTime
    investigatingUnit
    investigatedPatientByInvestigatedPatientId {
      covidPatientByCovidPatient {
        identityNumber
        fullName
        birthDate
        primaryPhone
      }
      identityType
      additionalPhoneNumber
      gender
      isDeceased
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
  allInvestigationSubStatuses {
    nodes {
      displayName
    }
  }
}
`;