import {gql} from 'postgraphile';

export const EDIT_CONTACT_EVENT = gql`
    mutation editContactEvent ($event: JSON!) {
        updateContactEventFunction(input: {inputData: $event}) {
            clientMutationId
        }
    }
`;

export const CREATE_CONTACT_EVENT = gql`
    mutation createContactEvent ($contactEvent: JSON!) {
        updateContactEventFunction(input: {inputData: $contactEvent}) {
            integer
        }
    }
`;

export const DELETE_CONTACT_EVENT = gql`
    mutation deleteContactEvent($contactEventIdToDelete: Int!) {
        deleteContactEventById(input: {id: $contactEventIdToDelete}) {
            clientMutationId
        }
    }
`;

export const DELETE_CONTACTED_PERSON = gql`
    mutation DeleteContactedPerson($contactedPersonId: Int!) {
        deleteContactedPersonById(input: {id: $contactedPersonId}) {
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