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
query getInvestigatedPatientDetails($id: Int!) {
    investigationByEpidemiologyNumber(epidemiologyNumber: $id) {
      investigatedPatientByInvestigatedPatientId {
        id
        covidPatientByCovidPatient {
          addressByAddress {
            floor
            houseNum
            cityByCity {
              id
              displayName
            }
            streetByStreet {
              id
              displayName
            }
          }
          primaryPhone
        }
        patientContactPhoneNumber
        patientContactInfo
        subOccupation
        occupation
        otherOccupationExtraInfo
        hmo
        additionalPhoneNumber
        role
        educationGrade
        educationClassNumber
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

export const GET_ALL_INVESTIGATED_PATIENT_ROLES = gql`
query {
  allInvestigatedPatientRoles {
    nodes {
      id
      displayName
    }
  }
}
`;
