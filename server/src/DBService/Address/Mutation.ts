import { gql } from 'postgraphile';

export const CREATE_ADDRESS = gql`
    mutation createAddress ($input: InsertAndGetAddressIdInput!) {
        insertAndGetAddressId(input: $input) {
            integer
        }
    }
`;

export const UPDATE_ADDRESS = gql`
    mutation updateAddress($id: Int!, $addressPatch: AddressPatch!) {
        updateAddressById(input: {id: $id, addressPatch: $addressPatch}) {
            address { id }
        }
    }
`;

