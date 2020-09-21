import { stat } from 'fs';
import * as Actions from './formActionTypes';

const initialState: (boolean | null)[] = [null,null,null,null]

const formReducer = (state = initialState, action: Actions.formAction) : (boolean | null)[] => {
    switch (action.type) {
        case Actions.SET_FORM_STATE : {
            state[action.payload.id] = action.payload.isValid
        }
        default:  return state;
    }
}

export default formReducer;