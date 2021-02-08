import {gql} from 'postgraphile';

export const CREATE_OR_EDIT_CONTACT_EVENT = gql`
    mutation createOrEditContactEvent ($event: JSON!) {
        updateContactEventFunction(input: {inputData: $event}) {
            clientMutationId
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