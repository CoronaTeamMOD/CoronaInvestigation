import {gql} from 'postgraphile';

export const UPDATE_LIST_OF_CONTACTS = gql`
    mutation updateAllUnSavedContacts($unSavedContacts: JSON!) {
        updateContactPersons(input: {contactedPersons: $unSavedContacts}) {
            clientMutationId
        }
    }
`;

export const CHECK_FOR_DUPLICATE_IDS = gql`
    mutation checkForExistingIds($currInvestigationId: Int!, $idToCheck: String!, $interactedContactId: Int!) {
        checkDuplicatesIds(input: {curridentificationnumber: $idToCheck, investigationid: $currInvestigationId, interactedcontactid: $interactedContactId}) {
            boolean
        }
    }
`;
