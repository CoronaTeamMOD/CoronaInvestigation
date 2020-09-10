import { gql } from "postgraphile";

export const GET_USER_INVESTIGATIONS = gql`
query InvestigationsInfoByUser($id: String!) {
  userById(id: $id) {
    investigationsByCreator {
      nodes {
        epidemiologyNumber
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