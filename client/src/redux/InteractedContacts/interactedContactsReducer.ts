import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import * as Actions from './interactedContactsActionTypes';

export class FormStateObject {
    id: number;
    isValid: boolean;

    constructor(id: number, isValid: boolean) {
        this.id = id;
        this.isValid = isValid;
    }
}

export interface InteractedContactsState {
    pending: boolean;
    interactedContacts: GroupedInteractedContact[];
    formState: FormStateObject[];
    error: any;
}

const initialState: InteractedContactsState = {
    pending: false,
    interactedContacts: [],
    formState: [],
    error: null
};

const interactedContactsReducer = (state = initialState, action: Actions.InteractedContactAction): InteractedContactsState => {
    switch (action.type) {
        case Actions.GET_INTERACTED_CONTACTS_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.GET_INTERACTED_CONTACTS_SUCCESS:
            return {
                ...state,
                pending: false,
                interactedContacts: action.payload.interactedContacts,
                formState: action.payload.formState
            }
        case Actions.GET_INTERACTED_CONTACTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case Actions.SET_INTERACTED_CONTACTS_FORM_STATE:
            return {
                ...state,
                //interactedContacts: action.payload.interactedContacts,
               // formState: action.payload.formState
            }
        case Actions.SET_INTERACTED_CONTACT_PENDING:
            return {
                ...state,
                pending: true
            }
        case Actions.SET_INTERACTED_CONTACT_SUCCESS:
            return {
                ...state,
                pending: false
            }
        case Actions.SET_INTERACTED_CONTACT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: return state;
    }
}

export default interactedContactsReducer;