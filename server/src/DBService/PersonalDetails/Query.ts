import { gql } from 'postgraphile';

export const GET_OCCUPATIONS = gql`
query getAllOccupations {
    allOccupations {
        nodes {
            displayName
        }
    }
}  
`;

export const GET_HMOS = gql`
query getAllHmos {
    allHmos {
        nodes {
            displayName
        }
    }
}  
`;

export const GET_INVESTIGATED_PATIENT_DETAILS_BY_EPIDEMIOLOGY_NUMBER = gql`
query getInvestigationByEpidemiologyNumber($id: Int!) {
    investigationByEpidemiologyNumber(epidemiologyNumber: $id) {
      investigatedPatientByInvestigatedPatientId {
        id
        addressByAddress {
          city
          street
          floor
          houseNum
          cityByCity {
            displayName
          }
          streetByStreet {
            displayName
          }
        }
        personId
        patientContactPhoneNumber
        patientContactInfo
        subOccupation
        occupation
        otherOccupationExtraInfo
        hmo
        personByPersonId {
          additionalPhoneNumber
          phoneNumber
        }
        subOccupationBySubOccupation {
          city
          displayName
        }
      }
    }
  }
`;

export const GET_SUB_OCCUPATIONS_BY_OCCUPATION = gql`
query getSubOccupationsByOccupation($parentOccupation: String!) {
    allSubOccupations(condition: {parentOccupation: $parentOccupation}) {
      nodes {
        displayName
        id
      }
    }
  } 
`;

export const GET_EDUCATION_SUB_OCCUPATION_BY_CITY = gql`
query getEducationSubOccupationsByCity($city: String!) {
    allSubOccupations(condition: {parentOccupation: "מערכת החינוך", city: $city}) {
      nodes {
        displayName
        street
        id
      }
    }
  } 
`;

