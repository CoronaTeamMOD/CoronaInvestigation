import { gql } from 'postgraphile';

export const UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $hmo: String, $otherOccupationExtraInfo: String, $occupation: String, $patientContactPhoneNumber: String, $subOccupation: String, $patientContactInfo: String, $additionalPhoneNumber: String, $role: Int, $educationGrade: Int, $educationClassNumber: Int) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {hmo: $hmo, otherOccupationExtraInfo: $otherOccupationExtraInfo, occupation: $occupation, patientContactPhoneNumber: $patientContactPhoneNumber, subOccupation: $subOccupation, patientContactInfo: $patientContactInfo, additionalPhoneNumber: $additionalPhoneNumber, role: $role, educationGrade: $educationGrade, educationClassNumber: $educationClassNumber}, id: $id}) {
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

export const CALC_INVESTIGATION_COMPLEXITY = gql`
mutation calcInvestigationComplexity($epidemiologyNumber: Int!) {
    calcInvestigationComplexity(input: {epidemiologyNumberValue: $epidemiologyNumber}) {
      clientMutationId
    }
  }
`;

export const UPDATE_PERSONAL_INFO = gql`
mutation updatePersonalDetails($input: JSON!) {
    updatePersonalDetails(input: {personalDetails: $input}) {
      clientMutationId
    }
  }
`;
