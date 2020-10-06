import { gql } from "postgraphile";

export const UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $hmo: String!, $otherOccupationExtraInfo: String, $occupation: String, $patientContactPhoneNumber: String, $address: Int!, $subOccupation: String, $patientContactInfo: String) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {hmo: $hmo, otherOccupationExtraInfo: $otherOccupationExtraInfo, occupation: $occupation, patientContactPhoneNumber: $patientContactPhoneNumber, address: $address, subOccupation: $subOccupation, patientContactInfo: $patientContactInfo}, id: $id}) {
        personByPersonId {
            id
          }
    }
}
`;

export const UPDATE_PERSON_PERSONAL_INFO = gql`
mutation updatePersonPersonalInfo($id: Int!, $phoneNumber: String, $additionalPhoneNumber: String) {
    updatePersonById(input: {personPatch: {phoneNumber: $phoneNumber, additionalPhoneNumber: $additionalPhoneNumber}, id: $id}) {
        clientMutationId
    }
}
`;