import { gql } from "postgraphile";

export const GET_INVESTIGATION_INFO = gql`
query InvestigationInfo($id: Int!) {
    investigatedPatientById(id: $id) {
        personByPersonInfo {
            firstName
            lastName
            idNumber
            identificationType
        }
        birthdate
        gender
        startDatetime
        updateDatetime
        investigatingUnit
    }   
}
`;