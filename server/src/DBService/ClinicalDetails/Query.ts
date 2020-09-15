import { gql } from 'postgraphile';

export const GET_BACKGROUND_DISEASES = gql`
query getAllBackgroundDeseases {
    allBackgroundDeseases {
      nodes {
        displayName
      }
    }
  }  
`;

export const GET_SYMPTOMS = gql`
query getAllSymptoms {
    allSymptoms {
      nodes {
        displayName
      }
    }
  }  
`;

export const GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER  = gql`
query investigationByEpidemiologyNumber($epidemiologyNumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    investigatedPatientByInvestigatedPatientId {
      isPregnant
      doesHaveBackgroundDiseases
      investigationsByInvestigatedPatientId {
        nodes {
          addressByIsolationAddress {
            floor
            houseNum
            streetByStreet {
              displayName
              id
            }
            cityByCity {
              displayName
              id
            }
          }
          isolationStartTime
          isolationEndTime
          isIsolationProblem
          isInIsolation
          isIsolationProblemMoreInfo
          symptomsStartTime
          hospital
          hospitalizationStartTime
          hospitalizationEndTime
          otherSymptomsMoreInfo
          investigatedPatientSymptomsByInvestigationId {
            nodes {
              symptomName
            }
          }
          doesHaveSymptoms
          wasHospitalized
        }
      }
      investigatedPatientBackgroundDiseasesByInvestigatedPatientId {
        nodes {
          backgroundDeseasName
        }
      }
    }
  }
}
`;
