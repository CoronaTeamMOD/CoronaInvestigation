import ContactType from 'models/ContactType';

export const SET_CONTACT_TYPES = 'SET_CONTACT_TYPES';

interface SetContactType {
    type: typeof SET_CONTACT_TYPES,
    payload: { contactTypes: Map<number, ContactType> }
}

export type contactTypeAction = SetContactType;
