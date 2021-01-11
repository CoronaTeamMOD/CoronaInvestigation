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

export const GET_ALL_SYMPTOMS = gql`
query getAllSymptoms {
    allSymptoms {
      nodes {
        displayName
      }
    }
  }  
`;

export const GET_ISOLATION_SOURCES = gql`
query getAllIsolationSources {
  allIsolationSources(orderBy: DESCRIPTION_ASC) {
    nodes {
      id
      description
    }
  }
}
`;

export const GET_INVESTIGATED_PATIENT_CLINICAL_DETAILS_BY_EPIDEMIOLOGY_NUMBER = gql`
query investigationByEpidemiologyNumber($epidemiologyNumber: Int!) {
  investigationByEpidemiologyNumber(epidemiologyNumber: $epidemiologyNumber) {
    isolationAddress: addressByIsolationAddress {
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
      id
    }
    symptomsStartDate: symptomsStartTime
    isolationStartTime
    isolationEndTime
    isolationSource
    isIsolationProblem
    isInIsolation
    isIsolationProblemMoreInfo
    symptomsStartTime
    hospital
    hospitalizationStartTime
    hospitalizationEndTime
    otherSymptomsMoreInfo
    symptoms: investigatedPatientSymptomsByInvestigationId {
      nodes {
        symptomName
      }
    }
    doesHaveSymptoms
    wasHospitalized
    investigatedPatientByInvestigatedPatientId {
      isPregnant
      doesHaveBackgroundDiseases
      investigatedPatientBackgroundDiseasesByInvestigatedPatientId {
        nodes {
          backgroundDeseasName
        }
      }
      otherBackgroundDiseasesMoreInfo
    }
  }
}
`;

export const UPDATE_IS_DECEASED = gql`
mutation UpdateIsDeceased ($investigatedPatientId: Int!, $isDeceased: Boolean!) {
  updateInvestigatedPatientById(input: {investigatedPatientPatch: {isDeceased: $isDeceased}, id: $investigatedPatientId}) {
    clientMutationId
  }
}
`;

export const UPDATE_IS_CURRENTLY_HOSPITIALIZED = gql`
mutation UpdatedIsCurrentlyHospitalized($investigatedPatientId: Int!, $isCurrentlyHospitalized: Boolean!) {
  updateInvestigatedPatientById(input: {investigatedPatientPatch: {isCurrentlyHospitalized: $isCurrentlyHospitalized}, id: $investigatedPatientId}) {
    clientMutationId
  }
}
`;
