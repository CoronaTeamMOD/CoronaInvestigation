import { gql } from "postgraphile";

export const GET_PERSONAL_DETAILS = gql`
query GetPersonalDetails ($epidemioligyNumber: Int!) {
    investigationByEpidemioligyNumber(epidemioligyNumber: $epidemioligyNumber) {
      investigatedPatientByInvestigatedPatientId {
        personByPersonId {
          phoneNumber
          additionalPhoneNumber
          gender
          identificationType
          identificationNumber
        }
        hmo
        addressByAddress {
          city
          apartment
          entrance
          floor
          houseNum
          street
          neighbourhood
        }
      }
    }
  }
`;  