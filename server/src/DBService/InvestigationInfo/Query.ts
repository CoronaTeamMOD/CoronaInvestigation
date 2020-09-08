import { gql } from "postgraphile";

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails($investigationId: Int!) {
    investigationByEpidemioligyNumber(epidemioligyNumber: $investigationId) {
      startTime
      lastUpdateTime
      investigatingUnit
      userByCreator {
        personByPersonId {
          firstName
          lastName
          phoneNumber
          additionalPhoneNumber
          birthDate
          identificationNumber
          identificationType
          gender
        }
      }
      userByLastUpdator {
        personByPersonId {
          firstName
          lastName
          additionalPhoneNumber
          birthDate
          gender
          identificationNumber
          identificationType
          phoneNumber
        }
      }
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
    }
  }
`;