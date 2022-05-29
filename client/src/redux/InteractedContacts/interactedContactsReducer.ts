import GroupedInteractedContact from '../../models/ContactQuestioning/GroupedInteractedContact';
import * as Actions from './interactedContactsActionTypes';

export class FormStateObject {
    id: number;
    isValid: boolean | null;

    constructor(id: number, isValid: boolean | null) {
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

type ValueOf<T> = T[keyof T];

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
        case Actions.SET_INTERACTED_CONTACT:
            return {
                ...state,
                interactedContacts: state.interactedContacts.map(contact => {
                    if (contact.id == action.payload.id)
                        (contact[action.payload.propertyName] as ValueOf<GroupedInteractedContact>) = action.payload.value;
                    return contact;
                })
            }
            
        case Actions.SET_CONTACT_FORM_STATE:{
            const formState = [...state.formState]
            const index = formState.findIndex(obj=>obj.id==action.payload.id)
            if (index>-1){
                formState[index].isValid=action.payload.isValid;
            }
            else formState.push(new FormStateObject(action.payload.id,action.payload.isValid))

            return {
                ...state,
                formState: formState
            }
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
        case Actions.RESET_INTERACTED_CONTACTS:
            return {
                ...state,
                interactedContacts:[],
                formState:[]
            }
        default: return state;
    }
}

export default interactedContactsReducer;