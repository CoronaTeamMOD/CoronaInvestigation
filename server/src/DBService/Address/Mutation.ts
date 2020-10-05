import { gql } from 'postgraphile';

export const CREATE_ADDRESS = gql`
mutation createAddress ($input: InsertAndGetAddressIdInput!) {
    insertAndGetAddressId(input: $input) {
        integer
    }
}
`;