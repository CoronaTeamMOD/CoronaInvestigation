import GroupedInteractedContact from 'models/ContactQuestioning/GroupedInteractedContact';
import * as Actions from './interactedContactsActionTypes';

export interface InteractedContactsState {
    pending: boolean;
    interactedContacts: GroupedInteractedContact[];
    error: any;
}

const initialState :InteractedContactsState= {
    pending: false,
    interactedContacts: [],
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
                interactedContacts: action.payload.interactedContacts
            }
        case Actions.GET_INTERACTED_CONTACTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default: return state;
    }
}

export default interactedContactsReducer;
