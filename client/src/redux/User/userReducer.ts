import User from 'models/User';
import * as Actions from './userActionTypes';


const initialState: User = {
    id: 4,
    name: 'XXXXXX'
}

const userReducer = (state = initialState, action: Actions.UserAction) : User => {
    switch (action.type) {
        case Actions.SET_USER : return {...state, ...action.payload.user}

        default:  return state;
    }
}

export default userReducer;