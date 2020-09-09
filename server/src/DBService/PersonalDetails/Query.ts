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

export const GET_INVESTIGATED_PATIENT_ID_CITY_STREET_BY_EPIDEMIOLOGY_NUMBER = gql`
query MyQuery($id: Int!) {
    investigationByEpidemiologyNumber(epidemiologyNumber: $id) {
      investigatedPatientByInvestigatedPatientId {
        id
        addressByAddress {
          city
          street
        }
      }
    }
  }
`;
