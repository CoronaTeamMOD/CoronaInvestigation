import { gql } from "postgraphile";

// TODO: Check that works properly after the function is ready
export const EDIT_CONTACT_EVENT = gql`
mutation editContactEvent ($input: ContactEventInput!) {
    updateContactEvent(input: $input) {
      integer
    }
}   
`;

// TODO: Check that works properly after the function is ready
export const CREATE_CONTACT_EVENT = gql`
mutation createContactEvent ($input: ContactEventInput!) {
    updateContactEvent(input: $input) {
      integer
    }
}   
`; 
