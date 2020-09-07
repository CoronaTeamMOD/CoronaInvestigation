import { gql } from "postgraphile";

export const UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $hmo: String!, $workPlace: String!, $occupation: String!) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {hmo: $hmo, workPlace: $workPlace, occupation: $occupation}, id: $id}) {
        clientMutationId
    }
}
`;

export const UPDATE_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $phoneNumber: String!, $additionalPhoneNumber: String!) {
    updatePersonById(input: {personPatch: {phoneNumber: $phoneNumber, additionalPhoneNumber: $additionalPhoneNumber}, id: $id}) {
        clientMutationId
    }
}
`;

export const UPDATE_ADRESS = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $city: String!, $street: String!, $floor: Int!, $houseNum: Int!) { 
      updateAddressById(input: {addressPatch: {city: $city, street: $street, floor: $floor, houseNum: $houseNum}, id: $id}) {
        clientMutationId
      }
}
`;