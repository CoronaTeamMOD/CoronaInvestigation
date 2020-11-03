import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATION = gql`
mutation updateInvestigationByEpidemiologyNumber ($epidemiologyNumber: Int!, $hospital: String, $hospitalizationEndTime: Datetime, $hospitalizationStartTime: Datetime, $isIsolationProblem: Boolean, $isIsolationProblemMoreInfo: String, $isolationEndTime: Datetime, $isolationStartTime: Datetime, $symptomsStartTime: Datetime, $isolationAddress: Int, $isInIsolation: Boolean, $doesHaveSymptoms: Boolean, $wasHospitalized: Boolean, $otherSymptomsMoreInfo: String, $isolationSource: Int) {
        updateInvestigationByEpidemiologyNumber(input: {
            investigationPatch: {
                hospital: $hospital, 
                hospitalizationEndTime: $hospitalizationEndTime, 
                hospitalizationStartTime: $hospitalizationStartTime, 
                isIsolationProblem: $isIsolationProblem, 
                isIsolationProblemMoreInfo: $isIsolationProblemMoreInfo, 
                isolationEndTime: $isolationEndTime, 
                isolationStartTime: $isolationStartTime, 
                isolationSource: $isolationSource, 
                symptomsStartTime: $symptomsStartTime, 
                isolationAddress: $isolationAddress, 
                isInIsolation: $isInIsolation, 
                doesHaveSymptoms: $doesHaveSymptoms, 
                wasHospitalized: $wasHospitalized, 
                otherSymptomsMoreInfo: $otherSymptomsMoreInfo}, 
                epidemiologyNumber: $epidemiologyNumber
            }) {
      clientMutationId
    }
}
`;

export const ADD_BACKGROUND_DISEASES = gql`
mutation addBackgroundDeseases ($backgroundDeseases: [String!], $investigatedPatientId: Int!) {
    insertBackgroundDeseases(input: {backgroundDeseasesVal: $backgroundDeseases, investigatedPatientIdVal: $investigatedPatientId}) {
        clientMutationId
    }
}
`;

export const ADD_SYMPTOMS = gql`
mutation addSymptoms ($investigationIdValue: Int!, $symptomNames: [String!]) {
    insertSymptoms(input: {investigationIdValue: $investigationIdValue, symptomNames: $symptomNames}) {
        clientMutationId
    }
}
`;

export const UPDATE_INVESTIGATED_PATIENT_CLINICAL_DETAILS = gql`
mutation updateInvestigatedPatientById ($isPregnant: Boolean!, $id: Int!, $doesHaveBackgroundDiseases: Boolean, $otherBackgroundDiseasesMoreInfo: String) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {isPregnant: $isPregnant, doesHaveBackgroundDiseases: $doesHaveBackgroundDiseases, otherBackgroundDiseasesMoreInfo: $otherBackgroundDiseasesMoreInfo}, id: $id}) {
      clientMutationId
    }
}
`;
