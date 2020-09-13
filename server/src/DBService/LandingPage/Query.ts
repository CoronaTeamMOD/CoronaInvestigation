import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
query InvestigationsInfoByUser($userName: String!) {
  userById(id: $userName) {
    investigationsByCreator {
      nodes {
        epidemiologyNumber
        investigatedPatientByInvestigatedPatientId {
          addressByAddress {
            cityByCity {
              displayName
            }
          }
          personByPersonId {
            birthDate
            firstName
            lastName
            phoneNumber
          }
        }
        investigationStatusByInvestigationStatus {
          displayName
        }
      }
    }
  }
}

`;