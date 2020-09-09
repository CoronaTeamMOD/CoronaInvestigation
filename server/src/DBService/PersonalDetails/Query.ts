import { gql } from 'postgraphile';

export const GET_OCCUPATIONS = gql`
query MyQuery {
    allOccupations {
        nodes {
            displayName
        }
    }
}  
`;

export const GET_HMOS = gql`
query MyQuery {
    allHmos {
        nodes {
            displayName
        }
    }
}  
`;

export const GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER = gql`
query MyQuery($id: Int!) {
    investigationByEpidemiologyNumber(epidemiologyNumber: $id) {
      investigatedPatientByInvestigatedPatientId {
        id
        addressByAddress {
          city
          street
          floor
          houseNum
        }
        personId
        patientContactPhoneNumber
        subOccupation
        occupation
        hmo
        personByPersonId {
          additionalPhoneNumber
          phoneNumber
        }
      }
    }
  }
`;
