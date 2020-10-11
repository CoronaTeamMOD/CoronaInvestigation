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
        age
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