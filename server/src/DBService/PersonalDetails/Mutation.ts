import { gql } from "postgraphile";

export const UPDATE_INVESTIGATED_PERSON_PERSONAL_INFO = gql`
mutation updateInvestigatedPersonPersonalInfo($id: Int!, $hmo: String!, $otherOccupationExtraInfo: String, $occupation: String, $patientContactPhoneNumber: String, $address: Int!, $subOccupation: String) {
    updateInvestigatedPatientById(input: {investigatedPatientPatch: {hmo: $hmo, otherOccupationExtraInfo: $otherOccupationExtraInfo, occupation: $occupation, patientContactPhoneNumber: $patientContactPhoneNumber, address: $address, subOccupation: $subOccupation}, id: $id}) {
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

export const UPDATE_ADRESS = gql`
mutation updateAddress($id: Int!, $city: String!, $street: String!, $floor: Int, $houseNum: Int) { 
      updateAddressById(input: {addressPatch: {city: $city, street: $street, floor: $floor, houseNum: $houseNum}, id: $id}) {
        clientMutationId
      }
}
`;

export const CREATE_ADRESS = gql`
mutation createAddress($city: String, $street: String, $houseNum: Int, $floor: Int) {
    createAddress(input: {address: {city: $city, street: $street, houseNum: $houseNum, floor: $floor}}) {
      address {
        id
      }
    }
  }
`;