import { gql } from "postgraphile";

export const UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $hmo: String!, $otherOccupationExtraInfo: String, $occupation: String, $patientContactPhoneNumber: String, $subOccupation: String, $patientContactInfo: String, $additionalPhoneNumber: String) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {hmo: $hmo, otherOccupationExtraInfo: $otherOccupationExtraInfo, occupation: $occupation, patientContactPhoneNumber: $patientContactPhoneNumber, subOccupation: $subOccupation, patientContactInfo: $patientContactInfo, additionalPhoneNumber: $additionalPhoneNumber}, id: $id}) {
        covidPatientByCovidPatient {
            epidemiologyNumber
        }
    }
}
`;

export const UPDATE_COVID_PATIENT_PERSONAL_INFO = gql`
mutation updateCovidPatientPersonalInfo($id: Int!, $primaryPhone: String, $address: Int!) {
    updateCovidPatientByEpidemiologyNumber(input: {covidPatientPatch: {primaryPhone: $primaryPhone, address: $address}, epidemiologyNumber: $id}) {
        clientMutationId
    }
}
`;