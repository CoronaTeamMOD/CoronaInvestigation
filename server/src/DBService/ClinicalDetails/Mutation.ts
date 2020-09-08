import { gql } from "postgraphile";

export const CREATE_ADDRESS = gql`
mutation createAddress ($input: InsertAndGetAddressIdInput!) {
    insertAndGetAddressId(input: $input) {
      integer
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

export const ADD_BACKGROUND_DESEASES = gql`
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
