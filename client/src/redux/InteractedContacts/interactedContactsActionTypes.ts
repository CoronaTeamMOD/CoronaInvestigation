import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import { FormStateObject } from './interactedContactsReducer';

export const GET_INTERACTED_CONTACTS_PENDING = 'GET_INTERACTED_CONTACTS_PENDING';
export const GET_INTERACTED_CONTACTS_SUCCESS = 'GET_INTERACTED_CONTACTS_SUCCESS';
export const GET_INTERACTED_CONTACTS_ERROR = 'GET_INTERACTED_CONTACTS_ERROR';

export const SET_INTERACTED_CONTACT_PENDING = 'SETE_INTERACTED_CONTACT_PENDING';
export const SET_INTERACTED_CONTACT_SUCCESS = 'SET_INTERACTED_CONTACT_SUCCESS';
export const SET_INTERACTED_CONTACT_ERROR = 'SET_INTERACTED_CONTACT_ERROR';

export const SET_INTERACTED_CONTACT_FORM_STATE = 'SET_INTERACTED_CONTACT_FORM_STATE';

export const SET_INTERACTED_CONTACTS_PENDING = 'SETE_INTERACTED_CONTACTS_PENDING';
export const SET_INTERACTED_CONTACTS_SUCCESS = 'SET_INTERACTED_CONTACTS_SUCCESS';
export const SET_INTERACTED_CONTACTS_ERROR = 'SET_INTERACTED_CONTACTS_ERROR';

interface GetInteractedContactsPending {
    type: typeof GET_INTERACTED_CONTACTS_PENDING
}

interface SetInteractedContactsFormState {
    type: typeof SET_INTERACTED_CONTACT_FORM_STATE,
    payload: { formState: Map<number, FormStateObject> }
}

interface GetInteractedContactsSuccess {
    type: typeof GET_INTERACTED_CONTACTS_SUCCESS,
    payload: {
        interactedContacts: GroupedInteractedContact[],
        formState: Map<number, FormStateObject>
    }
}

interface GetInteractedContactsError {
    type: typeof GET_INTERACTED_CONTACTS_ERROR,
    error: any
}

interface SetInteractedContactPending {
    type: typeof SET_INTERACTED_CONTACT_PENDING
}

interface SetInteractedContactSuccess {
    type: typeof SET_INTERACTED_CONTACT_SUCCESS,
    payload: {
        interactedContact: GroupedInteractedContact,
        formState: Map<number, FormStateObject>
    }
}

interface SetInteractedContactError {
    type: typeof SET_INTERACTED_CONTACT_ERROR,
    error: any
}

interface SetInteractedContactsPending {
    type: typeof SET_INTERACTED_CONTACTS_PENDING
}

interface SetInteractedContactsSuccess {
    type: typeof SET_INTERACTED_CONTACTS_SUCCESS,
    payload: { interactedContacts: GroupedInteractedContact[] }
}

interface SetInteractedContactsError {
    type: typeof SET_INTERACTED_CONTACTS_ERROR,
    error: any
}

export type InteractedContactAction = GetInteractedContactsPending | SetInteractedContactsFormState | GetInteractedContactsSuccess | GetInteractedContactsError
    | SetInteractedContactPending | SetInteractedContactSuccess | SetInteractedContactError | SetInteractedContactsPending | SetInteractedContactsSuccess | SetInteractedContactsError;