import User from 'models/User';
import * as Actions from './userActionTypes';

export const initialUserState: User = {
    id: '1',
    name: 'XXXXXX',
    token: 'demo token'
}

const userReducer = (state = initialUserState, action: Actions.UserAction) : User => {
    switch (action.type) {
        case Actions.SET_USER : return {...state, ...action.payload.user}

        default:  return state;
    }
}

export default userReducer;