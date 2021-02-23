import {gql} from 'postgraphile';

export const CREATE_OR_EDIT_CONTACT_EVENT = gql`
    mutation createOrEditContactEvent ($event: JSON!) {
        updateContactEventFunction(input: {inputData: $event}) {
            integers
        }
    }
`;

export const DELETE_CONTACT_EVENT = gql`
    mutation deleteContactEvent($contactEventId: Int!, $investigationId: Int!) {
        deleteContactEventFunction(input: {contactEventId: $contactEventId, investigationId: $investigationId}) {
            clientMutationId
        }
    }
`;

export const DELETE_CONTACTED_PERSON = gql`
    mutation deleteContactedPerson($contactedPersonId: Int!, $investigationId: Int!, $involvedContactId: Int) {
        deleteContactedPersonFunction(input: {contactedPersonId: $contactedPersonId, investigationId: $investigationId, involvedContactId: $involvedContactId}) {
            clientMutationId
        }
    }
`;

export const DELETE_CONTACT_EVENTS_BY_DATE = gql`
    mutation deleteIrrelevantContactEvents($earliestDate: String!, $investigationId: Int!) {
        deleteContactEventsBeforeDate(input: {currInvestigationId: $investigationId, earliestDate: $earliestDate}) {
            clientMutationId
        }
    }
`;

export const CREATE_CONTACTED_PERSON = gql`
    mutation MyMutation($params: ContactedPersonInput!) {
        createContactedPerson(input: {contactedPerson: $params}) {
            clientMutationId
        }
    }
`;

export const DUPLICATE_PERSON = gql`
    mutation duplicatePersonById($personId: BigInt!) {
        duplicatePersonById(input: {personid: $personId}) {
            bigInt
        }
    }
`;

export const ADD_CONTACTS_FROM_BANK = gql`
    mutation addContactsFromBank() {
        addContactsFromBank(input: {}) {
            clientMutationId
        }
    }
`;