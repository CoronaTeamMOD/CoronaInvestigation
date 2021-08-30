import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import { FormStateObject } from './interactedContactsReducer';

export const GET_INTERACTED_CONTACTS_PENDING = 'GET_INTERACTED_CONTACTS_PENDING';
export const GET_INTERACTED_CONTACTS_SUCCESS = 'GET_INTERACTED_CONTACTS_SUCCESS';
export const GET_INTERACTED_CONTACTS_ERROR = 'GET_INTERACTED_CONTACTS_ERROR';

export const SET_INTERACTED_CONTACT_PENDING = 'SET_INTERACTED_CONTACT_PENDING';
export const SET_INTERACTED_CONTACT_SUCCESS = 'SET_INTERACTED_CONTACT_SUCCESS';
export const SET_INTERACTED_CONTACT_ERROR = 'SET_INTERACTED_CONTACT_ERROR';

export const SET_INTERACTED_CONTACT = 'SET_INTERACTED_CONTACT';
export const SET_CONTACT_FORM_STATE = 'SET_CONTACT_FORM_STATE';

 type ValueOf<T> = T[keyof T];

interface GetInteractedContactsPending {
    type: typeof GET_INTERACTED_CONTACTS_PENDING
}

interface SetInteractedContact {
    type: typeof SET_INTERACTED_CONTACT,
    payload: {
        id: number,
        propertyName: keyof GroupedInteractedContact, 
        value: ValueOf<GroupedInteractedContact>
    }
}

interface SetContactFormState {
    type: typeof SET_CONTACT_FORM_STATE,
    payload: {
        id: number, 
        isValid: boolean
    }
}

interface GetInteractedContactsSuccess {
    type: typeof GET_INTERACTED_CONTACTS_SUCCESS,
    payload: {
        interactedContacts: GroupedInteractedContact[],
        formState: FormStateObject[]
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
        formState: FormStateObject[]
    }
}

interface SetInteractedContactError {
    type: typeof SET_INTERACTED_CONTACT_ERROR,
    error: any
}

export type InteractedContactAction = GetInteractedContactsPending | SetInteractedContact | SetContactFormState | GetInteractedContactsSuccess | GetInteractedContactsError
    | SetInteractedContactPending | SetInteractedContactSuccess | SetInteractedContactError;