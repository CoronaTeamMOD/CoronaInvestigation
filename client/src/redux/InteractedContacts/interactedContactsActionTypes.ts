import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';

export const GET_INTERACTED_CONTACTS_PENDING = 'GET_INTERACTED_CONTACTS_PENDING';
export const GET_INTERACTED_CONTACTS_SUCCESS = 'GET_INTERACTED_CONTACTS_SUCCESS';
export const GET_INTERACTED_CONTACTS_ERROR = 'GET_INTERACTED_CONTACTS_ERROR';

interface GetInteractedContactsPending {
    type: typeof GET_INTERACTED_CONTACTS_PENDING
}

interface GetInteractedContactsSuccess {
    type: typeof GET_INTERACTED_CONTACTS_SUCCESS,
    payload: { interactedContacts: GroupedInteractedContact[] }
}

interface GetInteractedContactsError {
    type:typeof GET_INTERACTED_CONTACTS_ERROR,
    error: any
}

export type InteractedContactAction = GetInteractedContactsPending | GetInteractedContactsSuccess | GetInteractedContactsError;