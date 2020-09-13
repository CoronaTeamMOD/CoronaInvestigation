import { gql } from 'postgraphile';

export const CREATE_ISOLATION_ADDRESS = gql`
mutation createAddress ($input: InsertAndGetAddressIdInput!) {
    insertAndGetAddressId(input: $input) {
        integer
    }
}
`;

export const UPDATE_INVESTIGATION = gql`
mutation updateInvestigationByEpidemiologyNumber ($epidemiologyNumber: Int!, $hospital: String, $hospitalizationEndTime: Datetime, $hospitalizationStartTime: Datetime, $isIsolationProblem: Boolean, $isIsolationProblemMoreInfo: String, $isolationEndTime: Datetime, $isolationStartTime: Datetime, $symptomsStartTime: Datetime, $isolationAddress: Int, $isInIsolation: Boolean, $doesHaveSymptoms: Boolean, $wasHospitalized: Boolean) {
        updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {hospital: $hospital, hospitalizationEndTime: $hospitalizationEndTime, hospitalizationStartTime: $hospitalizationStartTime, isIsolationProblem: $isIsolationProblem, isIsolationProblemMoreInfo: $isIsolationProblemMoreInfo, isolationEndTime: $isolationEndTime, isolationStartTime: $isolationStartTime, symptomsStartTime: $symptomsStartTime, isolationAddress: $isolationAddress, isInIsolation: $isInIsolation, doesHaveSymptoms: $doesHaveSymptoms, wasHospitalized: $wasHospitalized}, epidemiologyNumber: $epidemiologyNumber}) {
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
mutation updateInvestigatedPatientById ($isPregnant: Boolean!, $id: Int!, , $doesHaveBackgrounDiseases: Boolean) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {isPregnant: $isPregnant, doesHaveBackgrounDiseases: $doesHaveBackgrounDiseases}, id: $id}) {
      clientMutationId
    }
}
`;
