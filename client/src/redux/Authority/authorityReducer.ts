import Authority from 'models/Authority';

import * as Actions from './authorityActionTypes';

const initialState: Map<string, Authority> = new Map();

const authorityReducer = (state = initialState, action: Actions.authorityAction) : Map<string, Authority> => {
    switch (action.type) {
        case Actions.SET_AUTHORITIES: {
            return action.payload.authorities
        }
          
        default:  return state;
    }
}

export default authorityReducer;
