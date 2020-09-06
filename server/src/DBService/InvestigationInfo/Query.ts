import { gql } from "postgraphile";

export const GET_INVESTIGATION_INFO = gql`
query InvestigationStaticDetails ($investigationId: Int!) {
    investigationByEpidemioligyNumber(epidemioligyNumber: $investigationId) {
      startTime
      lastUpdateTime
      investigatingUnit
      userByCreator {
        personByPersonId {
          firstName
          lastName
          phoneNumber
        }
      }
      userByLastUpdator {
        personByPersonId {
          firstName
          lastName
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
        }
        isDeceased
      }
    }
  }
  
`;