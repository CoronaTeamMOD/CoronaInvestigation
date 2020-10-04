import * as Actions from './formActionTypes';

const initialState : {[key: number] : (boolean | null)[]} = {};

const formReducer = (state = initialState, action: Actions.formAction) : {[key: number] : (boolean | null)[]} => {
    switch (action.type) {
        case Actions.SET_FORM_STATE : {
            if(state[action.payload.investigationId] === undefined) {
                state[action.payload.investigationId] = [null,null,null,null,null];
            }
            state[action.payload.investigationId][action.payload.tabId] = action.payload.isValid;
        }
        default:  return state;
    }
}

export default formReducer;  