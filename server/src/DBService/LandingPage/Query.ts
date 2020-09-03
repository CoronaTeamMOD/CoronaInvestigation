import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
query InvestigationsInfoByUser($id: Int!) {
  userById(id: $id) {
    investigationsByCreator {
      nodes {
        epidemioligyNumber
        investigatedPatientByInvestigatedPatientId {
          addressByAddress {
            city
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