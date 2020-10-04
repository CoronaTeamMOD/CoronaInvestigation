import * as Actions from './formActionTypes';

const initialState : {[key: number] : (boolean | null)[]} = {};

const formReducer = (state = initialState, action: Actions.formAction) : {[key: number] : (boolean | null)[]} => {
    switch (action.type) {
        case Actions.SET_FORM_STATE : {
            const formsState = state[action.payload.investigationId] === undefined? 
                [null,null,null,null, null] : 
                [...state[action.payload.investigationId]];
            formsState[action.payload.tabId] = action.payload.isValid;
            return {
                ...state,
                [action.payload.investigationId]: formsState
            };
        }
        default:  return state;
    }
}

export default formReducer;  