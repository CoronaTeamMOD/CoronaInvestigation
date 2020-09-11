import { gql } from 'postgraphile';

export const CREATE_ISOLATION_ADDRESS = gql`
mutation createAddress ($input: InsertAndGetAddressIdInput!) {
    insertAndGetAddressId(input: $input) {
      integer
    }
}
`;

export const UPDATE_INVESTIGATION = gql`
mutation updateInvestigationByEpidemiologyNumber ($epidemiologyNumber: Int!, $hospital: String!, $hospitalizationEndTime: Datetime!, $hospitalizationStartTime: Datetime!, $investigatedPatientId: Int!, $isIsolationProblem: Boolean!, $isIsolationProblemMoreInfo: String!, $isolationEndTime: Datetime!, $isolationStartTime: Datetime!, $symptomsStartTime: Datetime!, $isolationAddress: Int!, $isInIsolation: Boolean!) {
        updateInvestigationByEpidemiologyNumber(input: {investigationPatch: {epidemiologyNumber: $epidemiologyNumber, hospital: $hospital, hospitalizationEndTime: $hospitalizationEndTime, hospitalizationStartTime: $hospitalizationStartTime, investigatedPatientId: $investigatedPatientId, isIsolationProblem: $isIsolationProblem, isIsolationProblemMoreInfo: $isIsolationProblemMoreInfo, isolationEndTime: $isolationEndTime, isolationStartTime: $isolationStartTime, symptomsStartTime: $symptomsStartTime, isolationAddress: $isolationAddress, isInIsolation: $isInIsolation}, epidemiologyNumber: $epidemiologyNumber}) {
      clientMutationId
    }
}
`;

export const ADD_BACKGROUND_DISEASES = gql`
mutation addBackgroundDeseases ($backgroundDeseases: [String!], $investigatedPatientId: Int!) {
    insertBackgroundDeseases(input: {backgroundDeseases: $backgroundDeseases, investigatedPatientId: $investigatedPatientId}) {
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

export const UPDATE_IS_PREGNANT = gql`
mutation updateInvestigatedPatientById ($isPregnant: Boolean!, $id: Int!) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {isPregnant: $isPregnant}, id: $id}) {
      clientMutationId
    }
}
`;
