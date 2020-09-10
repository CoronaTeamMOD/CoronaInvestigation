import { gql } from "postgraphile";

export const CREATE_ADDRESS = gql`
mutation createAddress ($address: AddressInput!) {
    createAddress(input: {address: $address}) {
        clientMutationId
    }
}
`;

export const CREATE_INVESTIGATION = gql`
mutation createInvestigation ($investigation: InvestigationInput!) {
    createInvestigation(input: {investigation: $investigation}) {
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
