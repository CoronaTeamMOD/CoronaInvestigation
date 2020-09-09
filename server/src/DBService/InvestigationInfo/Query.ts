import { gql } from "postgraphile";

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $investigationId) {
    startTime
    lastUpdateTime
    investigatingUnit
    investigatedPatientByInvestigatedPatientId {
      personByPersonId {
        identificationType
        identificationNumber
        gender
        firstName
        lastName
        birthDate
        additionalPhoneNumber
        phoneNumber
      }
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